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

        $('#anamnesi-attuale').hide();
        $('#anamnesi-remota').hide();
        $('#anamnesi-psico').hide();
        $('#anamnesi-familiare').hide();
        $('#farmaci-e-allergie').hide();
        
        if (!id) return;

        // recupera dati paziente base
        $.ajax({
            url: `${API_BASE}/api/pazienti/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (p) {
            $('#nome').val(p.nome || '');
            $('#cognome').val(p.cognome || '');
            $('#data_nascita').val(toIsoDate(p.data_nascita));
            $('#codice_fiscale').val(p.codice_fiscale || '');
        }).fail(function (xhr) {
            console.error('Impossibile caricare paziente:', xhr.status, xhr.responseText);
        });

        // recupera residenza (se presente)
        $.ajax({
            url: `${API_BASE}/api/residenze/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (r) {
            $('#indirizzo').val(r.indirizzo || '');
            $('#numero_civico').val(r.numero_civico || '');
            $('#citta').val(r.citta || '');
            $('#cap').val(r.cap || '');
        }).fail(function () {
            // ignora 404 (nessuna residenza)
        });

        // recupera contatti (se presente)
        $.ajax({
            url: `${API_BASE}/api/contatti/${id}`,
            method: 'GET',
            dataType: 'json',
            cache: false
        }).done(function (c) {
            $('#email').val(c.email || '');
            $('#telefono').val(c.telefono || '');
            $('#mobile').val(c.mobile || '');
        }).fail(function () {
            // ignora 404
        });
        if (isEdit){
            $('#testo_bottone').show().text('Modifica');
            $('#anamnesi-attuale').show().text('Attuale');
            $('#anamnesi-remota').show().text('Remota');
            $('#anamnesi-psico').show().text('Psico-Sociale');
            $('#anamnesi-familiare').show().text('Familiare');
            $('#farmaci-e-allergie').show().text('Farmaci e Allergie');
        }
    });
    
    $("#nuovo-paziente").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const $btn = $form.find("button[type=submit]");
        const originalBtnText = $btn.text();
        $btn.prop("disabled", true).text("Inserimento...");

        const API_BASE_URL = "http://localhost:5000";

        const datiAnagrafica = {
            nome: $("#nome").val(),
            cognome: $("#cognome").val(),
            data_nascita: $("#data_nascita").val(), // YYYY-MM-DD dal controllo date
            codice_fiscale: $("#codice_fiscale").val()
        };

        // formatta data da YYYY-MM-DD a DD-MM-YYYY
        if (datiAnagrafica.data_nascita) {
            const p = datiAnagrafica.data_nascita.split("-");
            if (p.length === 3) datiAnagrafica.data_nascita = `${p[2]}-${p[1]}-${p[0]}`;
        }
        if (datiAnagrafica.codice_fiscale) {
            datiAnagrafica.codice_fiscale = datiAnagrafica.codice_fiscale.toUpperCase();
        }

        const datiResidenza = {
            indirizzo: $("#indirizzo").val(),
            numero_civico: $("#numero_civico").val(),
            citta: $("#citta").val(),
            cap: $("#cap").val()
        };

        const datiContatto = {
            email: $("#email").val(),
            telefono: $("#telefono").val(),
            mobile: $("#mobile").val()
        };

        if (isEdit) {
            // UPDATE flow (PUT)
            $.ajax({
                url: `${API_BASE_URL}/api/aggiorna-paziente/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function () {
                $.ajax({
                    url: `${API_BASE_URL}/api/aggiorna-residenza/${id}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(datiResidenza)
                }).done(function () {
                    $.ajax({
                        url: `${API_BASE_URL}/api/aggiorna-contatti/${id}`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(datiContatto)
                    }, function (xhr) {
                        $btn.prop("disabled", false).text(originalBtnText);
                        alert("Errore salvataggio contatti: " + (xhr.responseText || xhr.status));
                    });
                }).fail(function (xhr) {
                    $btn.prop("disabled", false).text(originalBtnText);
                    alert("Errore salvataggio residenza: " + (xhr.responseText || xhr.status));
                }).done(function(){
                    alert("Modifica completata");
                    window.location.replace("pazienti.html");
                });
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore aggiornamento paziente: " + (xhr.responseText || xhr.status));
            });
        } else {
            
            $.ajax({
                url: `${API_BASE_URL}/api/nuovo-paziente`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datiAnagrafica)
            }).done(function (resp) {
                const pazienteId = resp && (resp.id || resp._id);
                if (!pazienteId) { $btn.prop("disabled", false).text(originalBtnText); alert("ID paziente non ricevuto"); return; }

                $.ajax({
                    url: `${API_BASE_URL}/api/aggiorna-residenza/${pazienteId}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(datiResidenza)
                }).done(function () {
                    $.ajax({
                        url: `${API_BASE_URL}/api/aggiorna-contatti/${id}`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(datiContatto)
                    }, function (xhr) {
                        $btn.prop("disabled", false).text(originalBtnText);
                        alert("Errore salvataggio contatti: " + (xhr.responseText || xhr.status));
                    });
                }).fail(function (xhr) {
                    $btn.prop("disabled", false).text(originalBtnText);
                    alert("Errore salvataggio residenza: " + (xhr.responseText || xhr.status));
                });
            }).fail(function (xhr) {
                $btn.prop("disabled", false).text(originalBtnText);
                alert("Errore creazione paziente: " + (xhr.responseText || xhr.status));
            });
        }
        setTimeout(() => {
            alert("Paziente aggiunto correttamente");
            window.location.replace("pazienti.html");
        }, 1500);
    });

    $("#anamnesi-attuale").on("click", function () {
        const id = getQueryParam('id');
        if (!id) {
            alert("ID paziente non trovato");
            return;
        }
        window.location.replace(`nuova-anamnesi-attuale.html?id=${id}`);
    });
    
    $("#anamnesi-remota").on("click", function () {
        const id = getQueryParam('id');
        if (!id) {
            alert("ID paziente non trovato");
            return;
        }
        window.location.replace(`nuova-anamnesi-remota.html?id=${id}`);
    });
    
    $("#anamnesi-familiare").on("click", function () {
        const id = getQueryParam('id');
        if (!id) {
            alert("ID paziente non trovato");
            return;
        }
        window.location.replace(`nuova-anamnesi-familiare.html?id=${id}`);
    });

    $("#anamnesi-psico").on("click", function () {
        const id = getQueryParam('id');
        if (!id) {
            alert("ID paziente non trovato");
            return;
        }
        window.location.replace(`nuova-anamnesi-psico-sociale.html?id=${id}`);
    });
    
    $("#farmaci-e-allergie").on("click", function () {
        const id = getQueryParam('id');
        if (!id) {
            alert("ID paziente non trovato");
            return;
        }
        window.location.replace(`nuova-farmaci-e-allergie.html?id=${id}`);
    });

    
});