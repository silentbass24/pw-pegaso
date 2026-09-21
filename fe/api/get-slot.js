function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

$(document).ready(function () {
    const API_BASE_URL = "http://localhost:5000";
    let pageSize = parseInt($('#slot-pagesize').val(), 10) || 10;
    let currentPage = 1;
    let medici = [];
    const $table = $('#slot-table');
    if ($table.length === 0) return;
    let $tbody = $table.find('tbody');
    if ($tbody.length === 0) { $tbody = $('<tbody/>').appendTo($table); }

    function renderPage(page) {
        currentPage = page;
        const start = (page - 1) * pageSize;
        const pageItems = slot.slice(start, start + pageSize);
        $tbody.empty();
        pageItems.forEach(s => {
            const $tr = $('<tr/>').addClass('hover:bg-gray-100');
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(s.ora_inizio || '')));
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(s.ora_fine || '')));

            const $actions = $('<td/>').addClass('py-3 px-4 flex items-center');

            const $editBtn = $('<button/>')
                .addClass('text-blue-500 mr-2')
                .attr('title', 'Modifica')
                .html('<span class="material-symbols-outlined">edit</span>');
            $editBtn.on('click', () => {
                window.location.href = `nuovo-slot.html?id=${s.id}`;
            });

            const $delBtn = $('<button/>')
                .addClass('text-red-500 mr-2')
                .attr('title', 'Elimina')
                .html('<span class="material-symbols-outlined">delete</span>');
            $delBtn.on('click', () => {
                if (!confirm(`Eliminare lo slot ${s.ora_inizio} - ${s.ora_fine}?`)) return;
                $.ajax({
                    url: API_BASE_URL + '/api/elimina-slot/' + s.id,
                    method: 'DELETE',
                    cache: false,
                    success: function () {
                        slot = slot.filter(x => x.id !== s.id);
                        const maxPage = Math.max(1, Math.ceil(slot.length / pageSize));
                        if (currentPage > maxPage) currentPage = maxPage;
                        renderPage(currentPage);
                    },
                    error: function (xhr, status, err) {
                        console.error('Errore eliminazione slot:', status, err);
                        alert('Impossibile eliminare lo slot. Controlla i log del server.');
                    }
                });
            });

            

            


            $actions.append($editBtn, $delBtn);
            $tr.append($actions);
            $tbody.append($tr);
        });
        buildPager();
    }

    function buildPager() {
        const $pager = $('#slot-pagination');
        if ($pager.length === 0) return;
        const totalPages = Math.max(1, Math.ceil(slot.length / pageSize));
        $pager.empty();

        const makeBtn = (label, pg, disabled) => {
            const $b = $('<button/>').text(label).addClass('mx-1 px-3 py-1 bg-white border rounded');
            if (disabled) $b.prop('disabled', true);
            $b.on('click', () => renderPage(pg));
            return $b;
        };

        $pager.append(makeBtn('« Prev', Math.max(1, currentPage - 1), currentPage === 1));
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);
        for (let i = start; i <= end; i++) {
            const $b = makeBtn(i, i, false);
            if (i === currentPage) $b.addClass('font-bold bg-gray-200');
            $pager.append($b);
        }
        $pager.append(makeBtn('Next »', Math.min(totalPages, currentPage + 1), currentPage === totalPages));
    }

    function fetchSlot() {
        $.ajax({
            url: API_BASE_URL + '/api/slot',
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.log('API slot response:', data);
                slot = Array.isArray(data) ? data : [];
                renderPage(1);
            },
            error: function (xhr, status, err) {
                console.error('Errore caricamento slot:', status, err);
            }
        });
    }

    $('#slot-pagesize').on('change', function () {
        pageSize = parseInt($(this).val(), 10) || 10;
        renderPage(1);
    });


    fetchSlot();
});