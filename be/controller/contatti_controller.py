from flask import jsonify, request
from marshmallow import ValidationError
from be.services.contatti_service import ContattiService
from be.dto.contatti_dto import ContattiResponseDTO, CreaContattiDTO, AggiornaContattiDTO
from datetime import datetime
from be.core.utilities import write_error_log


class ContattiController:
    def __init__(self, contatti_service):
        self.contatti_service = contatti_service or ContattiService()

    def get_contatti(self):
        contatti = self.contatti_service.get_all_contatti()
        return jsonify(contatti), 200

    def get_contatti_by_id(self, paziente_id):
        contatto = self.contatti_service.get_contatti_by_id(paziente_id)
        if contatto:
            return jsonify(contatto), 200
        else:
            return jsonify({'error': 'Contatto non trovato'}), 404
        
    def nuovo_contatto(self, contatto_data):
        try:
             contatto_validato = CreaContattiDTO().load(contatto_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_contatto = self.contatti_service.nuovo_contatto(contatto_validato)
        return jsonify(nuovo_contatto), 201
    
    def aggiorna_contatto(self, paziente_id, contatto_data):
        try:
            contatto_validato = AggiornaContattiDTO().load(contatto_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        contatto_aggiornato = self.contatti_service.aggiorna_contatti(paziente_id, contatto_validato)
        if contatto_aggiornato:
            return jsonify(contatto_aggiornato), 200
        else:
            return jsonify({'error': 'Contatto non trovato'}), 404
        
    def elimina_contatto(self, paziente_id):
        self.contatti_service.elimina_contatto(paziente_id)
        return jsonify({'message': 'Contatto eliminato'}), 200