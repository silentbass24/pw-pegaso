from flask import jsonify, request
from marshmallow import ValidationError
from be.services.stato_genitori_service import StatoGenitoriService
from be.dto.stato_genitori_dto import StatoGenitoriDTO, AggiornaStatoGenitoriDTO, StatoGenitoriResponseDTO
from datetime import datetime
from be.core.utilities import write_error_log


class StatoGenitoriController:
    def __init__(self, stato_genitori_service):
        self.stato_genitori_service = stato_genitori_service or StatoGenitoriService()
        

    def get_stato_genitori(self):
        stato_genitori = self.stato_genitori_service.get_all_stato_genitori()
        return jsonify(stato_genitori), 200

    def get_stato_genitori_by_id(self, stato_genitori_id):
        stato_genitori = self.stato_genitori_service.get_stato_genitori_by_id(stato_genitori_id)
        if stato_genitori:
            return jsonify(stato_genitori), 200
        else:
            return jsonify({'error': 'Stato Genitori non trovato'}), 404
        
    def nuova_stato_genitori(self, stato_genitori_data):
        try:
             stato_genitori_validata = StatoGenitoriDTO().load(stato_genitori_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_stato_genitori = self.stato_genitori_service.nuovo_stato_genitori(stato_genitori_validata)
        return jsonify(nuovo_stato_genitori), 201
    
    def aggiorna_stato_genitori(self, stato_genitori_id, stato_genitori_data):
        try:
            stato_genitori_validata = AggiornaStatoGenitoriDTO().load(stato_genitori_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        stato_genitori_aggiornata = self.stato_genitori_service.aggiorna_stato_genitori(stato_genitori_id, stato_genitori_validata)
        if stato_genitori_aggiornata:
            return jsonify(stato_genitori_aggiornata), 200
        else:
            return jsonify({'error': 'Stato Genitori non trovato'}), 404
        
    def elimina_stato_genitori(self, stato_genitori_id):
        self.stato_genitori_service.elimina_stato_genitori(stato_genitori_id)
        return jsonify({'message': 'Stato Genitori eliminata'}), 200