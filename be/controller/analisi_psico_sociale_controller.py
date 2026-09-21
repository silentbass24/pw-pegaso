from flask import jsonify, request
from marshmallow import ValidationError
from be.services.ananlisi_psico_sociale_service import AnalisiPsicoSocialeService
from be.dto.analisi_psico_sociale_dto import AnalisiPsicoSocialeResponseDTO, AggiornaAnalisiPsicoSocialeDTO, CreaAnalisiPsicoSocialeDTO
from datetime import datetime
from be.core.utilities import write_error_log


class AnalisiPsicoSocialeController:
    def __init__(self, analisi_service):
        self.analisi_service = analisi_service or AnalisiPsicoSocialeService()
        

    def get_analisi(self):
        analisi = self.analisi_service.get_all_analisi()
        return jsonify(analisi), 200

    def get_analisi_by_id(self, analisi_id):
        analisi = self.analisi_service.get_analisi_by_id(analisi_id)
        if analisi:
            return jsonify(analisi), 200
        else:
            return jsonify({'error': 'Analisi non trovato'}), 404
        
    def nuovo_analisi(self, analisi_data):
        try:
             analisi_validata = CreaAnalisiPsicoSocialeDTO().load(analisi_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_analisi = self.analisi_service.nuovo_analisi(analisi_validata)
        return jsonify(nuovo_analisi), 201
    
    def aggiorna_analisi(self, analisi_id, analisi_data):
        try:
            analisi_validata = AggiornaAnalisiPsicoSocialeDTO().load(analisi_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        analisi_aggiornata = self.analisi_service.aggiorna_analisi(analisi_id, analisi_validata)
        if analisi_aggiornata:
            return jsonify(analisi_aggiornata), 200
        else:
            return jsonify({'error': 'Analisi non trovato'}), 404
        
    def elimina_analisi(self, analisi_id):
        self.analisi_service.elimina_analisi(analisi_id)
        return jsonify({'message': 'Analisi eliminata'}), 200