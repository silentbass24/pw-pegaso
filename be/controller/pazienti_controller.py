from flask import jsonify, request
from marshmallow import ValidationError
from be.services.pazienti_service import PazientiService
from be.dto.paziente_dto import PazienteResponseDTO, CreaPazienteDTO, AggiornaPazienteDTO
from datetime import datetime
from be.core.utilities import write_error_log


class PazientiController:
    def __init__(self, pazienti_service):
        self.pazienti_service = pazienti_service or PazientiService()

    def get_pazienti(self):
        pazienti = self.pazienti_service.get_all_pazienti()
        return jsonify(pazienti), 200

    def get_paziente_by_id(self, paziente_id):
        paziente = self.pazienti_service.get_paziente_by_id(paziente_id)
        if paziente:
            return jsonify(paziente), 200
        else:
            return jsonify({'error': 'Paziente non trovato'}), 404
        
    def nuovo_paziente(self, paziente_data):
        try:
             paziente_validato = CreaPazienteDTO().load(paziente_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        if 'data_nascita' in paziente_validato and isinstance(paziente_validato['data_nascita'], str):
            try:
                paziente_validato['data_nascita'] = datetime.strptime(paziente_validato['data_nascita'], '%d-%m-%Y').date()
            except ValueError:
                return jsonify({'error': 'Formato data non valido, usare DD-MM-YYYY'}), 400
        
        nuovo_paziente = self.pazienti_service.nuovo_paziente(paziente_validato)
        return jsonify(nuovo_paziente), 201
    
    def aggiorna_paziente(self, paziente_id, paziente_data):
        try:
            paziente_validato = AggiornaPazienteDTO().load(paziente_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        if 'data_nascita' in paziente_validato and isinstance(paziente_validato['data_nascita'], str):
            try:
                paziente_validato['data_nascita'] = datetime.strptime(paziente_validato['data_nascita'], '%d-%m-%Y').date()
            except ValueError:
                return jsonify({'error': 'Formato data non valido, usare DD-MM-YYYY'}), 400
        paziente_aggiornato = self.pazienti_service.aggiorna_paziente(paziente_id, paziente_validato)
        if paziente_aggiornato:
            return jsonify(paziente_aggiornato), 200
        else:
            return jsonify({'error': 'Paziente non trovato'}), 404
        
    def elimina_paziente(self, paziente_id):
        self.pazienti_service.elimina_paziente(paziente_id)
        return jsonify({'message': 'Paziente eliminato'}), 200