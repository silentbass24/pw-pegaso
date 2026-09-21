from flask import jsonify, request
from marshmallow import ValidationError
from be.services.slot_service import SlotService
from be.dto.slot_dto import SlotResponseDTO, CreaSlotDTO, AggiornaSlotDTO
from datetime import datetime
from be.core.utilities import write_error_log


class SlotController:
    def __init__(self, slot_service):
        self.slot_service = slot_service or SlotService()
        

    def get_slots(self):
        slots = self.slot_service.get_all_slots()
        return jsonify(slots), 200

    def get_slot_by_id(self, slot_id):
        slot = self.slot_service.get_slot_by_id(slot_id)
        if slot:
            return jsonify(slot), 200
        else:
            return jsonify({'error': 'Slot non trovato'}), 404
        
    def nuovo_slot(self, slot_data):
        try:
             slot_validata = CreaSlotDTO().load(slot_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        nuovo_slot = self.slot_service.nuovo_slot(slot_validata)
        return jsonify(nuovo_slot), 201
    
    def aggiorna_slot(self, slot_id, slot_data):
        try:
            slot_validata = AggiornaSlotDTO().load(slot_data)
        except ValidationError as err:
            write_error_log(f"Errore di validazione: {err.messages}")
            return jsonify({'error': 'Dati non validi', 'details': err.messages}), 400
        
        slot_aggiornato = self.slot_service.aggiorna_slot(slot_id, slot_validata)
        if slot_aggiornato:
            return jsonify(slot_aggiornato), 200
        else:
            return jsonify({'error': 'Slot non trovato'}), 404
        
    def elimina_slot(self, slot_id):
        self.slot_service.elimina_slot(slot_id)
        return jsonify({'message': 'Slot eliminato'}), 200