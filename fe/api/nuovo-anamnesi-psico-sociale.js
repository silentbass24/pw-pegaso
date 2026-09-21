$(document).ready(function () {
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
        const $modificaPazienteLink = $('.modifica-paziente-link');
        $modificaPazienteLink.attr('href', `nuovo-paziente.html?id=${id}`);
        
        $.ajax({
            url: `${API_BASE}/api/analisi/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (a) {
            esiste = true;
            $('#lavoro').val(a.lavoro || '');
            $('#stress').val(a.stress || '');
            $('#supporto_familiare').val(a.supporto_familiare || '');
            $('#condizioni_abitative').val(a.condizioni_abitative || '');
            $('#testo_bottone').text('Modifica');
        }).fail(function (xhr) {
            if (xhr && xhr.status !== 404) console.error('Impossibile caricare anamnesi:', xhr.status, xhr.responseText);
            esiste = false;
            $('#testo_bottone').text('Salva');
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
        }).fail(function (xhr) {
            console.error('Impossibile caricare paziente:', xhr.status, xhr.responseText);
        });
    }());



    $("#nuova-anamnesi-psico").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Inserimento...");

        const datiAnagrafica = {
            condizioni_abitative: $("#condizioni_abitative").val(),
            lavoro: $("#lavoro").val(),
            stress: $("#stress").val(),
            supporto_familiare: $("#supporto_familiare").val(),
            id_paziente: id
        };

        const datiAnagraficaAgg = {
            condizioni_abitative: $("#condizioni_abitative").val(),
            lavoro: $("#lavoro").val(),
            stress: $("#stress").val(),
            supporto_familiare: $("#supporto_familiare").val()
        };

        const API_BASE_URL = "http://localhost:5000";

        if (esiste) {
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-analisi/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagraficaAgg)
            }).done(function () {
                alert("Anamnesi patologica remota aggiornata correttamente");
                window.location.replace(`nuova-anamnesi-psico-sociale.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento anamnesi patologica remota: " + (xhr.responseText || xhr.status));
            });
        } else {
            $.ajax({
                url: `${API_BASE_URL}/api/nuova-analisi`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function () {
                alert("Anamnesi psico-sociale creata correttamente");
                window.location.replace(`nuova-anamnesi-psico-sociale.html?id=${id}`);
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione anamnesi patologica remota: " + (xhr.responseText || xhr.status));
            });
        }
    });
});