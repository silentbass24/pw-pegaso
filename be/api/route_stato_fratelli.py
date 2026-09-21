import be.controller.stato_fratelli_controller as stato_fratelli_controller
from flask import Flask, Blueprint, request
from be.services.stato_fratelli_service import StatoFratelliService



api = Blueprint('stato_fratelli_api', __name__, url_prefix='/api')
stato_fratelli_ctrl = stato_fratelli_controller.StatoFratelliController(StatoFratelliService())

'''API RESTful per la gestione dello stato dei fratelli. Include endpoint per creare, leggere, aggiornare ed eliminare lo stato dei fratelli.'''
@api.route('/stato-fratelli', methods=['GET'])
def get_stato_fratelli():
    """
    Recupera tutti gli stati dei fratelli
    ---
    tags:
      - Stato Fratelli
    responses:
      200:
        description: Lista degli stati dei fratelli
        schema:
          type: array
          items:
            $ref: '#/definitions/StatoFratelliResponseDTO'
    """
    return stato_fratelli_ctrl.get_stato_fratelli()


@api.route('/stato-fratelli/<stato_fratelli_id>', methods=['GET'])
def get_stato_fratelli_by_id(stato_fratelli_id):
    """
    Recupera uno stato dei fratelli specifico
    ---
    tags:
      - Stato Fratelli
    parameters:
      - name: stato_fratelli_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Stato dei fratelli trovato
        schema:
          $ref: '#/definitions/StatoFratelliResponseDTO'
    """
    return stato_fratelli_ctrl.get_stato_fratelli_by_id(stato_fratelli_id)

@api.route('/nuovo-stato-fratelli', methods=['POST'])
def nuova_stato_fratelli():
    """
    Crea un nuovo stato dei fratelli
    ---
    tags:
      - Stato Fratelli
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/StatoFratelliDTO'
    responses:
      201:
        description: Stato dei fratelli creato
        schema:
          $ref: '#/definitions/StatoFratelliResponseDTO'
    """
    stato_fratelli_data = request.get_json()
    return stato_fratelli_ctrl.nuova_stato_fratelli(stato_fratelli_data)

@api.route('/aggiorna-stato-fratelli/<stato_fratelli_id>', methods=['PUT'])
def aggiorna_stato_fratelli(stato_fratelli_id):
    """
    Aggiorna uno stato dei fratelli
    ---
    tags:
      - Stato Fratelli
    parameters:
      - name: stato_fratelli_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaStatoFratelliDTO'
    responses:
      200:
        description: Stato dei fratelli aggiornato
        schema:
          $ref: '#/definitions/StatoFratelliResponseDTO'
    """
    stato_fratelli_data = request.get_json()
    return stato_fratelli_ctrl.aggiorna_stato_fratelli(stato_fratelli_id, stato_fratelli_data)

@api.route('/elimina-stato-fratelli/<stato_fratelli_id>', methods=['DELETE'])
def elimina_stato_fratelli(stato_fratelli_id):
    """
    Elimina uno stato dei fratelli
    ---
    tags:
      - Stato Fratelli
    parameters:
      - name: stato_fratelli_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Stato dei fratelli eliminato
    """
    return stato_fratelli_ctrl.elimina_stato_fratelli(stato_fratelli_id)