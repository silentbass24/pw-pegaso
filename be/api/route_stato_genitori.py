import be.controller.stato_genitori_controller as stato_genitori_controller
from flask import Flask, Blueprint, request
from be.services.stato_genitori_service import StatoGenitoriService



api = Blueprint('stato_genitori_api', __name__, url_prefix='/api')
stato_genitori_ctrl = stato_genitori_controller.StatoGenitoriController(StatoGenitoriService())

'''API RESTful per la gestione dello stato dei genitori. Include endpoint per creare, leggere, aggiornare ed eliminare lo stato dei genitori.'''
@api.route('/stato-genitori', methods=['GET'])
def get_stato_genitori():
    """
    Recupera tutti gli stati dei genitori
    ---
    tags:
      - Stato Genitori
    responses:
      200:
        description: Lista degli stati dei genitori
        schema:
          type: array
          items:
            $ref: '#/definitions/StatoGenitoriResponseDTO'
    """
    return stato_genitori_ctrl.get_stato_genitori()


@api.route('/stato-genitori/<stato_genitori_id>', methods=['GET'])
def get_stato_genitori_by_id(stato_genitori_id):
    """
    Recupera uno stato dei genitori specifico
    ---
    tags:
      - Stato Genitori
    parameters:
      - name: stato_genitori_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Stato dei genitori trovato
        schema:
          $ref: '#/definitions/StatoGenitoriResponseDTO'
    """
    return stato_genitori_ctrl.get_stato_genitori_by_id(stato_genitori_id)

@api.route('/nuovo-stato-genitori', methods=['POST'])
def nuova_stato_genitori():
    """
    Crea un nuovo stato dei genitori
    ---
    tags:
      - Stato Genitori
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/StatoGenitoriDTO'
    responses:
      201:
        description: Stato dei genitori creato
        schema:
          $ref: '#/definitions/StatoGenitoriResponseDTO'
    """
    stato_genitori_data = request.get_json()
    return stato_genitori_ctrl.nuova_stato_genitori(stato_genitori_data)

@api.route('/aggiorna-stato-genitori/<stato_genitori_id>', methods=['PUT'])
def aggiorna_stato_genitori(stato_genitori_id):
    """
    Aggiorna uno stato dei genitori
    ---
    tags:
      - Stato Genitori
    parameters:
      - name: stato_genitori_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaStatoGenitoriDTO'
    responses:
      200:
        description: Stato dei genitori aggiornato
        schema:
          $ref: '#/definitions/StatoGenitoriResponseDTO'
    """
    stato_genitori_data = request.get_json()
    return stato_genitori_ctrl.aggiorna_stato_genitori(stato_genitori_id, stato_genitori_data)

@api.route('/elimina-stato-genitori/<stato_genitori_id>', methods=['DELETE'])
def elimina_stato_genitori(stato_genitori_id):
    """
    Elimina uno stato dei genitori
    ---
    tags:
      - Stato Genitori
    parameters:
      - name: stato_genitori_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Stato dei genitori eliminato
    """
    return stato_genitori_ctrl.elimina_stato_genitori(stato_genitori_id)