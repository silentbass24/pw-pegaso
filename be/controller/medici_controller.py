from flask import jsonify, request
from marshmallow import ValidationError
from be.services.medici_service import MediciService
from be.dto.medico_dto import MedicoResponseDTO, CreaMedicoDTO, AggiornaMedicoDTO
from datetime import datetime
from be.core.utilities import write_error_log


class MediciController:
    def __init__(self, medici_service):
        self.medici_service = medici_service or MediciService()

    def get_medici(self):
        medici = self.medici_service.get_all_medici()
        return jsonify(medici), 200

    def get_medico_by_id(self, medico_id):
        medico = self.medici_service.get_medico_by_id(medico_id)
        if medico:
            return jsonify(medico), 200
        else:
            return jsonify({'error': 'Medico non trovato'}), 404
        
    def nuovo_medico(self, medico_data):
        try:
             medico_validato = CreaMedicoDTO().load(medico_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_medico = self.medici_service.nuovo_medico(medico_validato)
        return jsonify(nuovo_medico), 201
    
    def aggiorna_medico(self, medico_id, medico_data):
        try:
            medico_validato = AggiornaMedicoDTO().load(medico_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        medico_aggiornato = self.medici_service.aggiorna_medico(medico_id, medico_validato)
        if medico_aggiornato:
            return jsonify(medico_aggiornato), 200
        else:
            return jsonify({'error': 'Medico non trovato'}), 404
        
    def elimina_medico(self, medico_id):
        self.medici_service.elimina_medico(medico_id)
        return jsonify({'message': 'Medico eliminato'}), 200