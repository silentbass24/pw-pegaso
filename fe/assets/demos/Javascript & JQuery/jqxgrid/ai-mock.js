/*
 * Offline AI mock for the jqxGrid AI demos.
 *
 * A drop-in "aiSendRequest" callback that simulates an AI provider entirely in
 * the browser - no key, no network - so the AI grid demos run anywhere. It reads
 * the SAME column schema the real model receives (from payload.system) and
 * returns the SAME shaped results (a JSON command, a prose answer, a label
 * array), so the grid's real apply/validate path is exercised end to end.
 *
 * In production you drop this and set aiKey (trials) or aiProxyUrl / a real
 * aiSendRequest that forwards to Claude / OpenAI.
 *
 *   $('#grid').jqxGrid({ aiSendRequest: jqxGridAIMock });
 */
(function () {
    // parse "- First Name => firstname : string" lines from the system prompt.
    function parseColumns(system) {
        var cols = [], re = /- (.+?) => (\w+) : (\w+)/g, m;
        while ((m = re.exec(system)) !== null) {
            cols.push({ label: m[1].toLowerCase().trim(), datafield: m[2], type: m[3] });
        }
        return cols;
    }

    var COMPARATORS = [
        [/\b(greater than or equal|at least|>=)\b/, 'GREATER_THAN_OR_EQUAL'],
        [/\b(less than or equal|at most|<=)\b/, 'LESS_THAN_OR_EQUAL'],
        [/\b(over|above|greater than|more than|bigger than|>)\b/, 'GREATER_THAN'],
        [/\b(under|below|less than|fewer than|smaller than|<)\b/, 'LESS_THAN'],
        [/\b(not equal|not equals|isn'?t|is not|!=)\b/, 'NOT_EQUAL'],
        [/\b(starts with|starting with|begins with)\b/, 'STARTS_WITH'],
        [/\b(ends with|ending with)\b/, 'ENDS_WITH'],
        [/\b(contains|containing|has|like|includes)\b/, 'CONTAINS'],
        [/\b(=|equals|equal to|is|are)\b/, 'EQUAL']
    ];

    function findColumn(text, cols) {
        for (var i = 0; i < cols.length; i++) {
            if (text.indexOf(cols[i].datafield) !== -1 || text.indexOf(cols[i].label) !== -1) { return cols[i]; }
        }
        // match on any single word of a multi-word label (e.g. "name")
        for (var j = 0; j < cols.length; j++) {
            var parts = cols[j].label.split(/\s+/);
            for (var k = 0; k < parts.length; k++) { if (parts[k].length > 2 && text.indexOf(parts[k]) !== -1) { return cols[j]; } }
        }
        return null;
    }

    function extractValue(text, col) {
        var q = /['"]([^'"]+)['"]/.exec(text);
        if (q) { return q[1]; }
        if (col.type === 'number') { var n = /(-?\d+(?:\.\d+)?)/.exec(text); return n ? n[1] : null; }
        if (col.type === 'bool' || col.type === 'boolean') { return /\b(true|yes|available|checked)\b/.test(text); }
        // last capitalized / word token after the comparator
        var w = /(?:=|is|equals|contains|with|to|by)\s+([A-Za-z][\w-]+)/.exec(text);
        return w ? w[1] : null;
    }

    function buildCommand(user, cols) {
        var q = (user || '').toLowerCase();
        var spec = { filters: [] };
        if (/\b(clear|reset|remove all|start over)\b/.test(q)) { spec.clear = true; }

        // split into clauses on and / , / ; and parse each for a filter
        var clauses = q.split(/\s+and\s+|,|;/);
        for (var c = 0; c < clauses.length; c++) {
            var clause = clauses[c];
            var op = null;
            for (var i = 0; i < COMPARATORS.length; i++) { if (COMPARATORS[i][0].test(clause)) { op = COMPARATORS[i][1]; break; } }
            if (!op) { continue; }
            var col = findColumn(clause, cols);
            if (!col) {
                // infer a numeric column when a comparison has no explicit column,
                // e.g. "orders over $4" -> the price/amount column.
                var moneyish = /\$|\bprice\b|\bvalue\b|\brevenue\b|\bcost\b|\bamount\b/.test(clause);
                for (var mi = 0; mi < cols.length && !col; mi++) {
                    if (cols[mi].type === 'number' && (!moneyish || /price|value|revenue|cost|amount/.test(cols[mi].datafield + ' ' + cols[mi].label))) { col = cols[mi]; }
                }
                if (!col) { for (var ni = 0; ni < cols.length && !col; ni++) { if (cols[ni].type === 'number') { col = cols[ni]; } } }
            }
            if (!col) { continue; }
            var value = extractValue(clause, col);
            if (value === null || value === undefined || value === '') { continue; }
            // strings default to CONTAINS when the op is a bare "is/="
            if (col.type === 'string' && op === 'EQUAL' && !/['"]/.test(clause)) { op = 'CONTAINS'; }
            spec.filters.push({ field: col.datafield, operator: op, value: value, logic: 'AND' });
        }

        // sort: "sort by <col> desc|asc"
        var s = /sort(?:ed)?\s+by\s+([a-z ]+?)(?:\s+(asc|ascending|desc|descending))?(?:$|,| and )/.exec(q);
        if (s) {
            var scol = findColumn(s[1].trim(), cols);
            if (scol) { spec.sort = { field: scol.datafield, direction: /desc/.test(s[2] || '') ? 'desc' : 'asc' }; }
        }
        // group: "group by <col>"
        var g = /group\s+by\s+([a-z ]+?)(?:$|,| and )/.exec(q);
        if (g) { var gcol = findColumn(g[1].trim(), cols); if (gcol) { spec.group = [gcol.datafield]; } }

        return spec;
    }

    function buildAsk(user, cols, sampleJson) {
        // detect intent from the question only (the first block) - the appended
        // context contains words like "count" from the aggregates.
        var q = (user || '').split('\n\n')[0].toLowerCase();
        var rows = [];
        try { rows = JSON.parse((/Sample rows \(JSON\):\s*(\[[\s\S]*)/.exec(user) || [])[1] || '[]'); } catch (e) { }
        // prefer the numeric column named in the question, else the first numeric.
        var numCol = null, i, j;
        for (i = 0; i < cols.length; i++) { if (cols[i].type === 'number' && (q.indexOf(cols[i].datafield) !== -1 || q.indexOf(cols[i].label) !== -1)) { numCol = cols[i]; break; } }
        if (!numCol) { for (i = 0; i < cols.length; i++) { if (cols[i].type === 'number') { numCol = cols[i]; break; } } }
        var catCol = null; for (j = 0; j < cols.length; j++) { if (cols[j].type === 'string') { catCol = cols[j]; break; } }

        if (numCol && /average|avg|mean/.test(q)) {
            var sum = 0, n = 0; rows.forEach(function (r) { var v = parseFloat(r[numCol.datafield]); if (!isNaN(v)) { sum += v; n++; } });
            var avg = n ? (sum / n) : 0;
            return 'The average ' + numCol.label + ' across the ' + n + ' visible rows is about ' + avg.toFixed(2) + '.' +
                (catCol ? '\n\n```chart {"type":"column","categoryField":"' + catCol.datafield + '","valueField":"' + numCol.datafield + '","aggregate":"avg"}```' : '');
        }
        if (numCol && /(total|sum)/.test(q)) {
            var t = 0; rows.forEach(function (r) { var v = parseFloat(r[numCol.datafield]); if (!isNaN(v)) { t += v; } });
            return 'The total ' + numCol.label + ' is ' + t.toFixed(2) + ' over ' + rows.length + ' rows.';
        }
        if (/how many|count|number of rows/.test(q)) { return 'There are ' + rows.length + ' rows in the current (filtered) view.'; }
        return 'Based on the ' + rows.length + ' visible rows, ' + (catCol ? 'the data spans several ' + catCol.label + ' values' : 'the dataset looks consistent') +
            (numCol ? ' with ' + numCol.label + ' varying across records.' : '.') +
            (catCol && numCol ? '\n\n```chart {"type":"column","categoryField":"' + catCol.datafield + '","valueField":"' + numCol.datafield + '","aggregate":"sum"}```' : '');
    }

    function buildSummary(user) {
        var rows = [];
        try { rows = JSON.parse((/Rows \(JSON\):\s*([\s\S]*)/.exec(user) || [])[1] || '[]'); } catch (e) { }
        return 'These ' + rows.length + ' rows cover a mix of products and customers. Quantities and prices vary across the selection, ' +
            'with several repeat customers and a spread of order values - no single record dominates the set.';
    }

    function buildClassify(user, system) {
        var items = []; try { items = JSON.parse(user); } catch (e) { }
        var catMatch = /Use only these labels:\s*([^.\n]+)/.exec(system);
        var cats = catMatch ? catMatch[1].split(',').map(function (s) { return s.trim(); }) : ['Low', 'Medium', 'High'];
        // find a numeric field to bucket on
        var numField = null;
        if (items.length) { for (var k in items[0]) { if (typeof items[0][k] === 'number') { numField = k; break; } } }
        var vals = numField ? items.map(function (it) { return it[numField]; }) : [];
        var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), t1 = lo + (hi - lo) / 3, t2 = lo + 2 * (hi - lo) / 3;
        var labels = items.map(function (it) {
            if (!numField) { return cats[0]; }
            var v = it[numField];
            return v <= t1 ? cats[0] : v <= t2 ? (cats[1] || cats[0]) : (cats[2] || cats[cats.length - 1]);
        });
        return JSON.stringify(labels);
    }

    window.jqxGridAIMock = function (payload, grid) {
        var system = payload.system || '', user = payload.user || '';
        // columns may be listed in the system prompt (aiCommand) or in the
        // user context (aiAsk) - scan both.
        var cols = parseColumns(system + '\n' + user);
        var result;
        if (/translate a user request/i.test(system)) { result = JSON.stringify(buildCommand(user, cols)); }
        else if (/concise data analyst/i.test(system)) { result = buildAsk(user, cols); }
        else if (/summarize tabular data/i.test(system)) { result = buildSummary(user); }
        else if (/label each item/i.test(system)) { result = buildClassify(user, system); }
        else { result = 'This offline mock did not recognize the request type.'; }

        return new Promise(function (resolve) {
            setTimeout(function () { resolve(result); }, 350 + Math.random() * 250);
        });
    };
})();
