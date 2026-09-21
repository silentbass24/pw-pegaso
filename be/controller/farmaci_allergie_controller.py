from flask import jsonify, request
from marshmallow import ValidationError
from be.services.farmaci_allergie_service import FarmaciAllergieService
from be.dto.farmaci_allergie_dto import FarmaciAllergieResponseDTO, FarmaciAllergieDTO, AggiornaFarmaciAllergieDTO
from datetime import datetime
from be.core.utilities import write_error_log


class FarmaciAllergieController:
    def __init__(self, farmaci_allergie_service):
        self.farmaci_allergie_service = farmaci_allergie_service or FarmaciAllergieService()
        

    def get_farmaci_allergie(self):
        farmaci_allergie = self.farmaci_allergie_service.get_all_farmaci_allergie()
        return jsonify(farmaci_allergie), 200

    def get_farmaci_allergie_by_id(self, farmaci_allergie_id):
        farmaci_allergie = self.farmaci_allergie_service.get_farmaci_allergie_by_id(farmaci_allergie_id)
        if farmaci_allergie:
            return jsonify(farmaci_allergie), 200
        else:
            return jsonify({'error': 'Farmaci/Allergie non trovato'}), 404
        
    def nuova_farmaci_allergie(self, farmaci_allergie_data):
        try:
             farmaci_allergie_validata = FarmaciAllergieDTO().load(farmaci_allergie_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuova_farmaci_allergie = self.farmaci_allergie_service.nuova_farmaci_allergie(farmaci_allergie_validata)
        return jsonify(nuova_farmaci_allergie), 201
    
    def aggiorna_farmaci_allergie(self, farmaci_allergie_id, farmaci_allergie_data):
        try:
            farmaci_allergie_validata = AggiornaFarmaciAllergieDTO().load(farmaci_allergie_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        farmaci_allergie_aggiornata = self.farmaci_allergie_service.aggiorna_farmaci_allergie(farmaci_allergie_id, farmaci_allergie_validata)
        if farmaci_allergie_aggiornata:
            return jsonify(farmaci_allergie_aggiornata), 200
        else:
            return jsonify({'error': 'Farmaci/Allergie non trovato'}), 404
        
    def elimina_farmaci_allergie(self, farmaci_allergie_id):
        self.farmaci_allergie_service.elimina_farmaci_allergie(farmaci_allergie_id)
        return jsonify({'message': 'Farmaci/Allergie eliminata'}), 200