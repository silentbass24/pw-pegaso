from flask import jsonify, request
from marshmallow import ValidationError
from be.services.stato_fratelli_service import StatoFratelliService
from be.dto.stato_fratelli_dto import StatoFratelliResponseDTO, StatoFratelliDTO, AggiornaStatoFratelliDTO
from datetime import datetime
from be.core.utilities import write_error_log


class StatoFratelliController:
    def __init__(self, stato_fratelli_service):
        self.stato_fratelli_service = stato_fratelli_service or StatoFratelliService()
        

    def get_stato_fratelli(self):
        stato_fratelli = self.stato_fratelli_service.get_all_stato_fratelli()
        return jsonify(stato_fratelli), 200

    def get_stato_fratelli_by_id(self, stato_fratelli_id):
        stato_fratelli = self.stato_fratelli_service.get_stato_fratelli_by_id(stato_fratelli_id)
        if stato_fratelli:
            return jsonify(stato_fratelli), 200
        else:
            return jsonify({'error': 'Stato Fratelli non trovato'}), 404
        
    def nuova_stato_fratelli(self, stato_fratelli_data):
        try:
             stato_fratelli_validata = StatoFratelliDTO().load(stato_fratelli_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_stato_fratelli = self.stato_fratelli_service.nuovo_stato_fratelli(stato_fratelli_validata)
        return jsonify(nuovo_stato_fratelli), 201
    
    def aggiorna_stato_fratelli(self, stato_fratelli_id, stato_fratelli_data):
        try:
            stato_fratelli_validata = AggiornaStatoFratelliDTO().load(stato_fratelli_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        stato_fratelli_aggiornata = self.stato_fratelli_service.aggiorna_stato_fratelli(stato_fratelli_id, stato_fratelli_validata)
        if stato_fratelli_aggiornata:
            return jsonify(stato_fratelli_aggiornata), 200
        else:
            return jsonify({'error': 'Stato Fratelli non trovato'}), 404
        
    def elimina_stato_fratelli(self, stato_fratelli_id):
        self.stato_fratelli_service.elimina_stato_fratelli(stato_fratelli_id)
        return jsonify({'message': 'Stato Fratelli eliminata'}), 200