$(document).ready(function () {
    $('#testo_bottone').text('Salva');
    let isEdit = false;
    let id = '';
    // legge query param
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function toIsoDate(d) {
        if (!d) return '';
        // se formato DD-MM-YYYY -> converti
        const m = d.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        // se è datetime ISO, prendi parte data
        const iso = d.split('T')[0];
        return iso;
    }

    $(function () {
        const API_BASE = "http://localhost:5000";
        id = getQueryParam('id');
        isEdit = !!id
        
        if (!id) return;

        // recupera dati slot
        $.ajax({
            url: `${API_BASE}/api/slot/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (s) {
            $('#orario_inizio').val(s.ora_inizio || '');
            $('#orario_fine').val(s.ora_fine || '');
        }).fail(function (xhr) {
            console.error('Impossibile caricare medico:', xhr.status, xhr.responseText);
        });


        if (isEdit){
            $('#testo_bottone').text('Modifica');
        }
    });
    
    $("#nuovo-slot").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Inserimento...");

        const API_BASE_URL = "http://localhost:5000";

        const datiAnagrafica = {
            ora_inizio: $("#orario_inizio").val(),
            ora_fine: $("#orario_fine").val()
        };


        if (isEdit) {
            // UPDATE flow (PUT)
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-slot/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function () {
                alert("Slot aggiornato correttamente");
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento slot: " + (xhr.responseText || xhr.status));
            });
        } else {
            // CREATE flow (POST)
            $.ajax({
                url: `${API_BASE_URL}/api/nuovo-slot`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function (resp) {
                alert("Slot creato correttamente");
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione slot: " + (xhr.responseText || xhr.status));
            });
        }
        setTimeout(() => {
            alert("Slot aggiunto correttamente");
            window.location.replace("slot.html");
        }, 1500);
    });
});