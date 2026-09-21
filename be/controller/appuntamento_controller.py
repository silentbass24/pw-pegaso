from flask import jsonify, request
from marshmallow import ValidationError
from be.services.appuntamento_service import AppuntamentoService
from be.dto.appuntamento_dto import AppuntamentoResponseDTO, AggiornaAppuntamentoDTO, CreaAppuntamentoDTO
from datetime import datetime
from be.core.utilities import write_error_log


class AppuntamentoController:
    def __init__(self, appuntamento_service):
        self.appuntamento_service = appuntamento_service or AppuntamentoService()
        

    def get_appuntamenti(self):
        appuntamenti = self.appuntamento_service.get_all_appuntamenti()
        return jsonify(appuntamenti), 200
    
    def get_appuntamenti_dettagli(self):
            appuntamenti = self.appuntamento_service.get_all_appuntamenti_con_dettagli()
            return jsonify(appuntamenti), 200

    def get_appuntamento_by_id(self, appuntamento_id):
        appuntamento = self.appuntamento_service.get_appuntamento_by_id(appuntamento_id)
        if appuntamento:
            return jsonify(appuntamento), 200
        else:
            return jsonify({'error': 'Appuntamento non trovato'}), 404
        
    def nuovo_appuntamento(self, appuntamento_data):
        try:
             appuntamento_validata = CreaAppuntamentoDTO().load(appuntamento_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_appuntamento = self.appuntamento_service.nuovo_appuntamento(appuntamento_validata)
        return jsonify(nuovo_appuntamento), 201
    
    def aggiorna_appuntamento(self, appuntamento_id, appuntamento_data):
        try:
            appuntamento_validata = AggiornaAppuntamentoDTO().load(appuntamento_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        appuntamento_aggiornato = self.appuntamento_service.aggiorna_appuntamento(appuntamento_id, appuntamento_validata)
        if appuntamento_aggiornato:
            return jsonify(appuntamento_aggiornato), 200
        else:
            return jsonify({'error': 'Appuntamento non trovato'}), 404
        
    def elimina_appuntamento(self, appuntamento_id):
        self.appuntamento_service.elimina_appuntamento(appuntamento_id)
        return jsonify({'message': 'Appuntamento eliminato'}), 200