from flask import jsonify, request
from marshmallow import ValidationError
from be.services.anamnesi_familiare_service import AnamnesiFamiliareService
from be.dto.anamnesi_familiare_dto import AnamnesiFamiliareResponseDTO, CreaAnamnesiFamiliareDTO, AggiornaAnamnesiFamiliareDTO
from datetime import datetime
from be.core.utilities import write_error_log


class AnamnesiFamiliareController:
    def __init__(self, anamnesi_service):
        self.anamnesi_service = anamnesi_service or AnamnesiFamiliareService()
        

    def get_anamnesi(self):
        anamnesi = self.anamnesi_service.get_all_anamnesi()
        return jsonify(anamnesi), 200

    def get_anamnesi_by_id(self, anamnesi_id):
        anamnesi = self.anamnesi_service.get_anamnesi_by_id(anamnesi_id)
        if anamnesi:
            return jsonify(anamnesi), 200
        else:
            return jsonify({'error': 'Anamnesi non trovato'}), 404
        
    def nuova_anamnesi(self, anamnesi_data):
        try:
             anamnesi_validata = CreaAnamnesiFamiliareDTO().load(anamnesi_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuova_anamnesi = self.anamnesi_service.nuova_anamnesi(anamnesi_validata)
        return jsonify(nuova_anamnesi), 201
    
    def aggiorna_anamnesi(self, anamnesi_id, anamnesi_data):
        try:
            anamnesi_validata = AggiornaAnamnesiFamiliareDTO().load(anamnesi_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        anamnesi_aggiornata = self.anamnesi_service.aggiorna_anamnesi(anamnesi_id, anamnesi_validata)
        if anamnesi_aggiornata:
            return jsonify(anamnesi_aggiornata), 200
        else:
            return jsonify({'error': 'Anamnesi non trovato'}), 404
        
    def elimina_anamnesi(self, anamnesi_id):
        self.anamnesi_service.elimina_anamnesi(anamnesi_id)
        return jsonify({'message': 'Anamnesi eliminata'}), 200