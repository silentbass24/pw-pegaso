$(document).ready(function () {
    $('#testo_bottone').text('Salva');
    let isEdit = false;
    let id = '';
    const API_BASE = "http://localhost:5000";

    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function toIsoDate(d) {
        if (!d) return '';
        const m = d.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        return (d || '').split('T')[0];
    }

    // formatta YYYY-MM-DD -> DD-MM-YYYY 
    function formatDateForDto(isoDate) {
        if (!isoDate) return null;
        const parts = isoDate.split('-');
        if (parts.length !== 3) return isoDate;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // inizializzazione: se c'è id carico paziente e (se presente) anamnesi
    (function init() {
        id = getQueryParam('id');
        esiste = false;


        if (!id) return;

        $.ajax({
            url: `${API_BASE}/api/anamnesi-patologica-attuale/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (a) {
            esiste = true;
        }).fail(function (xhr) {
            if (xhr && xhr.status !== 404) console.error('Impossibile caricare anamnesi:', xhr.status, xhr.responseText);
            esiste = false;
        });

        $modificaPazienteLink = $('.modifica-paziente-link');
        $modificaPazienteLink.attr('href', `nuovo-paziente.html?id=${id}`);
        // primo: carico dati paziente
        $.ajax({
            url: `${API_BASE}/api/pazienti/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (p) {
            const $nomeP = $('#nome-paziente');
            if ($nomeP.is('input,textarea')) $nomeP.val(`${p.nome || ''} ${p.cognome || ''}`.trim());
            else $nomeP.text(`${p.nome || ''} ${p.cognome || ''}`.trim());
            if (esiste) {
                $.ajax({
                    url: `${API_BASE}/api/anamnesi-patologica-attuale/${id}`,
                    method: 'GET',
                    dataType: 'json',
                    cache: false
                }).done(function (a) {
                    $('#sintomatologia_principale').val(a.sintomatologia_principale || '');
                    $('#insorgenza').val(a.insorgenza ? toIsoDate(a.insorgenza) : '');
                    $('#durata').val(a.durata || '');
                    $('#fattori_miglioramento').val(a.fattori_miglioramento || '');
                    $('#fattori_peggioramento').val(a.fattori_peggioramento || '');
                    $('#sintomi_associati').val(a.sintomi_associati || '');
                    $('#testo_bottone').text('Modifica');
                }).fail(function (xhr) {
                    if (xhr && xhr.status !== 404) console.error('Impossibile caricare anamnesi:', xhr.status, xhr.responseText);

                });
            }
        }).fail(function (xhr) {
            console.error('Impossibile caricare paziente:', xhr.status, xhr.responseText);
        });
    }());



    $("#nuova-anamnesi-attuale").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Inserimento...");

        const datiAnagrafica = {
            sintomatologia_principale: $("#sintomatologia_principale").val(),
            insorgenza: formatDateForDto($("#insorgenza").val()),
            durata: $("#durata").val(),
            fattori_miglioramento: $("#fattori_miglioramento").val(),
            fattori_peggioramento: $("#fattori_peggioramento").val(),
            sintomi_associati: $("#sintomi_associati").val(),
            id_paziente: id
        };

        const datiAnagraficaAgg = {
            sintomatologia_principale: $("#sintomatologia_principale").val(),
            insorgenza: formatDateForDto($("#insorgenza").val()),
            durata: $("#durata").val(),
            fattori_miglioramento: $("#fattori_miglioramento").val(),
            fattori_peggioramento: $("#fattori_peggioramento").val(),
            sintomi_associati: $("#sintomi_associati").val()
        };

        const API_BASE_URL = "http://localhost:5000";

        if (isEdit) {
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-anamnesi-patologica-attuale/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagraficaAgg)
            }).done(function () {
                alert("Anamnesi patologica attuale aggiornata correttamente");
                window.location.replace(`nuova-anamnesi-attuale.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento anamnesi patologica attuale: " + (xhr.responseText || xhr.status));
            });
        } else {
            $.ajax({
                url: `${API_BASE_URL}/api/nuova-anamnesi-patologica-attuale`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function () {
                alert("Anamnesi patologica attuale creata correttamente");
                window.location.replace(`nuovo-paziente.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione anamnesi patologica attuale: " + (xhr.responseText || xhr.status));
            });
        }
    });
});