from flask import jsonify, request
from marshmallow import ValidationError
from be.services.residenza_service import ResidenzaService
from be.dto.residenza_dto import ResidenzaResponseDTO, CreaResidenzaDTO, AggiornaResidenzaDTO
from datetime import datetime
from be.core.utilities import write_error_log


class ResidenzaController:
    def __init__(self, residenza_service):
        self.residenza_service = residenza_service or ResidenzaService()
        

    def get_residenze(self):
        residenze = self.residenza_service.get_all_residenze()
        return jsonify(residenze), 200

    def get_residenza_by_id(self, paziente_id):
        residenza = self.residenza_service.get_residenza_by_id(paziente_id)
        if residenza:
            return jsonify(residenza), 200
        else:
            return jsonify({'error': 'Residenza non trovata'}), 404
        
    def nuova_residenza(self, residenza_data):
        try:
             residenza_validata = CreaResidenzaDTO().load(residenza_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuova_residenza = self.residenza_service.nuova_residenza(residenza_validata)
        if not nuova_residenza:
            return jsonify({'error': 'Residenza già presente'}), 409
        return jsonify(nuova_residenza), 201
    
    def aggiorna_residenza(self, paziente_id, residenza_data):
        try:
            residenza_validata = AggiornaResidenzaDTO().load(residenza_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        residenza_aggiornata = self.residenza_service.aggiorna_residenza(paziente_id, residenza_validata)
        if residenza_aggiornata:
            return jsonify(residenza_aggiornata), 200
        else:
            return jsonify({'error': 'Residenza non trovata'}), 404
        
    def elimina_residenza(self, paziente_id):
        self.residenza_service.elimina_residenza(paziente_id)
        return jsonify({'message': 'Residenza eliminata'}), 200