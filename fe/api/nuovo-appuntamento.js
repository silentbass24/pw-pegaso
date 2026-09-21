$(document).ready(function () {
    $('#testo_bottone').text('Salva');
    let isEdit = false;
    let id = '';

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

    let tsMedico, tsPaziente, tsSlot;

    function popolaMedici(existingId) {
        const API_BASE = "http://localhost:5000";
        $.ajax({
            url: `${API_BASE}/api/medici`,
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                const items = Array.isArray(data) ? data : [];
                if (!tsMedico) {
                    tsMedico = new TomSelect('#id_medico', { create: false, valueField: 'value', labelField: 'text', searchField: 'text', placeholder: 'Seleziona un medico', maxOptions: 100 });
                } else tsMedico.clearOptions();
                tsMedico.addOption({ value: '', text: 'Seleziona un medico' });
                items.forEach(m => tsMedico.addOption({ value: m.id, text: `${m.nome || ''} ${m.cognome || ''} - ${m.specializzazione || ''}`.trim() }));
                if (existingId) tsMedico.setValue(existingId);
            },
            error: function (xhr, status, err) { console.error('Errore caricamento medici:', status, err); }
        });
    }

    function popolaPazienti(existingId) {
        const API_BASE = "http://localhost:5000";
        $.ajax({
            url: `${API_BASE}/api/pazienti`,
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                const items = Array.isArray(data) ? data : [];
                if (!tsPaziente) {
                    tsPaziente = new TomSelect('#id_paziente', { create: false, valueField: 'value', labelField: 'text', searchField: 'text', placeholder: 'Seleziona un paziente', maxOptions: 100 });
                } else tsPaziente.clearOptions();
                tsPaziente.addOption({ value: '', text: 'Seleziona un paziente' });
                items.forEach(p => tsPaziente.addOption({ value: p.id, text: `${p.nome || ''} ${p.cognome || ''}`.trim() }));
                if (existingId) tsPaziente.setValue(existingId);
            },
            error: function (xhr, status, err) { console.error('Errore caricamento pazienti:', status, err); }
        });
    }

    function popolaSlot(existingId) {
        const API_BASE = "http://localhost:5000";
        $.ajax({
            url: `${API_BASE}/api/slot`,
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                const items = Array.isArray(data) ? data : [];
                if (!tsSlot) {
                    tsSlot = new TomSelect('#id_slot', { create: false, valueField: 'value', labelField: 'text', searchField: 'text', placeholder: 'Seleziona una fascia oraria', maxOptions: 200 });
                } else tsSlot.clearOptions();
                tsSlot.addOption({ value: '', text: 'Seleziona una fascia oraria' });
                items.forEach(s => tsSlot.addOption({ value: s.id, text: `${s.ora_inizio || ''} - ${s.ora_fine || ''}`.trim() }));
                if (existingId) tsSlot.setValue(existingId);
            },
            error: function (xhr, status, err) { console.error('Errore caricamento slot:', status, err); }
        });
    }

    // chiamate iniziali (senza valori selezionati)
    popolaMedici();
    popolaPazienti();
    popolaSlot();

    $(function () {
        const API_BASE = "http://localhost:5000";
        id = getQueryParam('id');
        isEdit = !!id;

        if (!isEdit) return;

        // recupera dati appuntamento e popola form con i valori esistenti
        $.ajax({
            url: `${API_BASE}/api/appuntamenti/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (s) {
            // s dovrebbe contenere id_medico,id_paziente,id_slot,data (YYYY-MM-DD)
            $('#data').val(toIsoDate(s.data || ''));
            // ripopoliamo le select passando gli id esistenti così TomSelect li imposta
            popolaMedici(s.id_medico);
            popolaPazienti(s.id_paziente);
            popolaSlot(s.id_slot);
            $('#testo_bottone').text('Modifica');
        }).fail(function (xhr) {
            console.error('Impossibile caricare appuntamento:', xhr.status, xhr.responseText);
        });
    });

    // submit corretto (form id "#nuovo-appuntamento")
    $("#nuovo-appuntamento").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Invio...");

        const API_BASE_URL = "http://localhost:5000";

        const datiAppuntamento = {
            id_medico: $('#id_medico').val(),
            id_paziente: $('#id_paziente').val(),
            id_slot: $('#id_slot').val(),
            data: $('#data').val()
        };

        if (isEdit) {
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-appuntamento/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAppuntamento)
            }).done(function () {
                alert("Appuntamento aggiornato correttamente");
                window.location.replace("appuntamenti.html");
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento appuntamento: " + (xhr.responseText || xhr.status));
            });
        } else {
            $.ajax({
                url: `${API_BASE_URL}/api/nuovo-appuntamento`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAppuntamento)
            }).done(function () {
                alert("Appuntamento creato correttamente");
                window.location.replace("appuntamenti.html");
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione appuntamento: " + (xhr.responseText || xhr.status));
            });
        }
    });
});