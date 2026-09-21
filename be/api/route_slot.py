import be.controller.slot_controller as slot_controller
from flask import Flask, Blueprint, request
from be.services.slot_service import SlotService



api = Blueprint('slot_api', __name__, url_prefix='/api')
slotctrl = slot_controller.SlotController(SlotService())

'''API RESTful per la gestione degli slot.'''
@api.route('/slot', methods=['GET'])
def get_slot():
    """
    Recupera tutti gli slot
    ---
    tags:
      - Slot
    responses:
      200:
        description: Lista degli slot
        schema:
          type: array
          items:
            $ref: '#/definitions/SlotResponseDTO'
    """
    return slotctrl.get_slots()


@api.route('/slot/<slot_id>', methods=['GET'])
def get_slot_by_id(slot_id):
    """
    Recupera uno slot specifico
    ---
    tags:
      - Slot
    parameters:
      - name: slot_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Slot trovato
        schema:
          $ref: '#/definitions/SlotResponseDTO'
    """
    return slotctrl.get_slot_by_id(slot_id)

@api.route('/nuovo-slot', methods=['POST'])
def nuovo_slot():
    """
    Crea un nuovo slot
    ---
    tags:
      - Slot
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaSlotDTO'
    responses:
      201:
        description: Slot creato
        schema:
          $ref: '#/definitions/SlotResponseDTO'
    """
    slot_data = request.get_json()
    return slotctrl.nuovo_slot(slot_data)

@api.route('/aggiorna-slot/<slot_id>', methods=['PUT'])
def aggiorna_slot(slot_id):
    """
    Aggiorna uno slot
    ---
    tags:
      - Slot
    parameters:
      - name: slot_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaSlotDTO'
    responses:
      200:
        description: Slot aggiornato
        schema:
          $ref: '#/definitions/SlotResponseDTO'
    """
    slot_data = request.get_json()
    return slotctrl.aggiorna_slot(slot_id, slot_data)

@api.route('/elimina-slot/<slot_id>', methods=['DELETE'])
def elimina_slot(slot_id):
    """
    Elimina uno slot
    ---
    tags:
      - Slot
    parameters:
      - name: slot_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Slot eliminato
    """
    return slotctrl.elimina_slot(slot_id)