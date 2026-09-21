function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

$(document).ready(function () {
    const API_BASE_URL = "http://localhost:5000";
    let pageSize = parseInt($('#pazienti-pagesize').val(), 10) || 10;
    let currentPage = 1;
    let pazienti = [];
    const $table = $('#pazienti-table');
    if ($table.length === 0) return;
    let $tbody = $table.find('tbody');
    if ($tbody.length === 0) { $tbody = $('<tbody/>').appendTo($table); }

    function renderPage(page) {
        currentPage = page;
        const start = (page - 1) * pageSize;
        const pageItems = pazienti.slice(start, start + pageSize);
        $tbody.empty();
        pageItems.forEach(p => {
            const $tr = $('<tr/>').addClass('hover:bg-gray-100');
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(p.nome || '')));
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(p.cognome || '')));
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(p.data_nascita || '')));
            $tr.append($('<td/>').addClass('py-3 px-4').html(escapeHtml(p.codice_fiscale || '')));

            const $actions = $('<td/>').addClass('py-3 px-4 flex items-center');

            const $editBtn = $('<button/>')
                .addClass('text-blue-500 mr-2')
                .attr('title', 'Modifica')
                .html('<span class="material-symbols-outlined">edit</span>');
            $editBtn.on('click', () => {
                window.location.href = `nuovo-paziente.html?id=${p.id}`;
            });

            const $delBtn = $('<button/>')
                .addClass('text-red-500 mr-2')
                .attr('title', 'Elimina')
                .html('<span class="material-symbols-outlined">delete</span>');
            $delBtn.on('click', () => {
                if (!confirm(`Eliminare il paziente ${p.nome} ${p.cognome}?`)) return;
                $.ajax({
                    url: API_BASE_URL + '/api/elimina-paziente/' + p.id,
                    method: 'DELETE',
                    cache: false,
                    success: function () {
                        pazienti = pazienti.filter(x => x.id !== p.id);
                        const maxPage = Math.max(1, Math.ceil(pazienti.length / pageSize));
                        if (currentPage > maxPage) currentPage = maxPage;
                        renderPage(currentPage);
                    },
                    error: function (xhr, status, err) {
                        console.error('Errore eliminazione paziente:', status, err);
                        alert('Impossibile eliminare il paziente. Controlla i log del server.');
                    }
                });
            });

            const $infoBtn = $('<button/>')
                .addClass('text-yellow-300 mr-2')
                .attr('title', 'Contatti')
                .html('<span class="material-symbols-outlined" aria-hidden="true">info</span>');
            $infoBtn.on('click', () => {
                $.ajax({
                    url: API_BASE_URL + '/api/contatti/' + p.id,
                    method: 'GET',
                    cache: false,
                    success: function (data) {
                        // alert(`Contatti del paziente ${p.nome} ${p.cognome}:\nTelefono: ${data.telefono}\nEmail: ${data.email}`);
                        $('#modal-title').text(`Contatti di ${p.nome} ${p.cognome}`);
                        $('#modal-phone').text(data.telefono);
                        $('#modal-email').text(data.email);
                        $('#patient-info-modal').removeClass('hidden').addClass('flex');
                        
                    },
                    error: function (xhr, status, err) {
                        console.error('Errore recupero contatti paziente:', status, err);
                        alert('Impossibile recuperare i contatti del paziente. Controlla i log del server.');
                    }
                });
            });

            const $residenzaBtn = $('<button/>')
                .addClass('text-grey-300')
                .attr('title', 'Residenza')
                .html('<span class="material-symbols-outlined">map</span>');
            $residenzaBtn.on('click', () => {
                $.ajax({
                    url: API_BASE_URL + '/api/residenze/' + p.id,
                    method: 'GET',
                    cache: false,
                    success: function (data) {
                        // alert(`Residenza del paziente ${p.nome} ${p.cognome}:\nIndirizzo: ${data.indirizzo}\nCittà: ${data.citta}\nCAP: ${data.cap}`);
                        $('#modal-residenza-title').text(`Residenza di ${p.nome} ${p.cognome}`);
                        $('#modal-indirizzo').text(data.indirizzo);
                        $('#modal-citta').text(data.citta);
                        $('#modal-cap').text(data.cap);
                        $('#patient-residenza-modal').removeClass('hidden').addClass('flex');
                    },
                    error: function (xhr, status, err) {
                        console.error('Errore recupero residenza paziente:', status, err);
                        alert('Impossibile recuperare la residenza del paziente. Controlla i log del server.');
                    }
                });
            });


            $actions.append($editBtn, $delBtn, $infoBtn, $residenzaBtn);
            $tr.append($actions);
            $tbody.append($tr);
        });
        buildPager();
    }

    function buildPager() {
        const $pager = $('#pazienti-pagination');
        if ($pager.length === 0) return;
        const totalPages = Math.max(1, Math.ceil(pazienti.length / pageSize));
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

    function fetchPazienti() {
        $.ajax({
            url: API_BASE_URL + '/api/pazienti',
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.log('API pazienti response:', data);
                pazienti = Array.isArray(data) ? data : [];
                renderPage(1);
            },
            error: function (xhr, status, err) {
                console.error('Errore caricamento pazienti:', status, err);
            }
        });
    }

    $('#pazienti-pagesize').on('change', function () {
        pageSize = parseInt($(this).val(), 10) || 10;
        renderPage(1);
    });

    $('#modal-close, #patient-info-modal').on('click', function (e) {
        if (e.target !== this && e.target.id !== 'modal-close') return;
        $('#patient-info-modal').addClass('hidden').removeClass('flex');
    });
    $('#modal-residenza-close, #patient-residenza-modal').on('click', function (e) {
        if (e.target !== this && e.target.id !== 'modal-residenza-close') return;
        $('#patient-residenza\-modal').addClass('hidden').removeClass('flex');
    });

    fetchPazienti();
});