$(document).ready(function () {
    $('#testo_bottone').text('Salva');
    let isEdit = false;
    let id = '';
    const API_BASE = "http://localhost:5000";
    let esiste = false;

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
        console.log('init js loaded, id=', id);
        const $modificaPazienteLink = $('.modifica-paziente-link');
        console.log('$modificaPazienteLink length=', $modificaPazienteLink.length);
        $modificaPazienteLink.attr('href', `nuovo-paziente.html?id=${id}`);

        $.ajax({
            url: `${API_BASE}/api/anamnesi-patologica-remota/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (a) {
            esiste = true;
        }).fail(function (xhr) {
            if (xhr && xhr.status !== 404) console.error('Impossibile caricare anamnesi:', xhr.status, xhr.responseText);
            esiste = false;
        });

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
                    url: `${API_BASE}/api/anamnesi-patologica-remota/${id}`,
                    method: 'GET',
                    dataType: 'json',
                    cache: false
                }).done(function (a) {
                    $('#malattie_pregresse').val(a.malattie_pregresse || '');
                    $('#interventi_chirurgici').val(a.interventi_chirurgici || '');
                    $('#ricoveri').val(a.ricoveri || '');
                    $('#traumi').val(a.traumi || '');
                    $('#testo_bottone').text('Modifica');
                }).fail(function (xhr) {
                    if (xhr && xhr.status !== 404) console.error('Impossibile caricare anamnesi:', xhr.status, xhr.responseText);

                });
            }
        }).fail(function (xhr) {
            console.error('Impossibile caricare paziente:', xhr.status, xhr.responseText);
        });
    }());



    $("#nuova-anamnesi-remota").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Inserimento...");

        const datiAnagrafica = {
            malattie_pregresse: $("#malattie_pregresse").val(),
            interventi_chirurgici: $("#interventi_chirurgici").val(),
            ricoveri: $("#ricoveri").val(),
            traumi: $("#traumi").val(),
            id_paziente: id
        };

        const datiAnagraficaAgg = {
            malattie_pregresse: $("#malattie_pregresse").val(),
            interventi_chirurgici: $("#interventi_chirurgici").val(),
            ricoveri: $("#ricoveri").val(),
            traumi: $("#traumi").val()
        };

        const API_BASE_URL = "http://localhost:5000";

        if (isEdit) {
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-anamnesi-patologica-remota/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagraficaAgg)
            }).done(function () {
                alert("Anamnesi patologica remota aggiornata correttamente");
                window.location.replace(`nuova-anamnesi-remota.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento anamnesi patologica remota: " + (xhr.responseText || xhr.status));
            });
        } else {
            $.ajax({
                url: `${API_BASE_URL}/api/nuova-anamnesi-patologica-remota`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function () {
                alert("Anamnesi patologica remota creata correttamente");
                window.location.replace(`nuovo-paziente.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione anamnesi patologica remota: " + (xhr.responseText || xhr.status));
            });
        }
    });
});