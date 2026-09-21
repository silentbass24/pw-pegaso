import be.controller.residenza_controller as residenza_controller
from flask import Flask, Blueprint, request
from be.services.residenza_service import ResidenzaService



api = Blueprint('residenza_api', __name__, url_prefix='/api')
residenzactrl = residenza_controller.ResidenzaController(ResidenzaService())

'''API RESTful per la gestione delle residenze dei pazienti.'''
@api.route('/residenze', methods=['GET'])
def get_residenze():
    """
    Recupera tutte le residenze dei pazienti
    ---
    tags:
      - Residenze
    responses:
      200:
        description: Lista delle residenze dei pazienti
        schema:
          type: array
          items:
            $ref: '#/definitions/ResidenzaResponseDTO'
    """
    return residenzactrl.get_residenze()


@api.route('/residenze/<paziente_id>', methods=['GET'])
def get_residenza_by_id(paziente_id):
    """
    Recupera la residenza di un paziente specifico
    ---
    tags:
      - Residenze
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Residenza trovata
        schema:
          $ref: '#/definitions/ResidenzaResponseDTO'
    """
    return residenzactrl.get_residenza_by_id(paziente_id)

@api.route('/nuova-residenza', methods=['POST'])
def nuova_residenza():
    """
    Crea una nuova residenza per il paziente
    ---
    tags:
      - Residenze
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaResidenzaDTO'
    responses:
      201:
        description: Residenza creata
        schema:
          $ref: '#/definitions/ResidenzaResponseDTO'
    """
    residenza_data = request.get_json()
    return residenzactrl.nuova_residenza(residenza_data)

@api.route('/aggiorna-residenza/<paziente_id>', methods=['PUT'])
def aggiorna_residenza(paziente_id):
    """
    Aggiorna la residenza di un paziente
    ---
    tags:
      - Residenze
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaResidenzaDTO'
    responses:
      200:
        description: Residenza aggiornata
        schema:
          $ref: '#/definitions/ResidenzaResponseDTO'
    """
    residenza_data = request.get_json()
    return residenzactrl.aggiorna_residenza(paziente_id, residenza_data)

@api.route('/elimina-reidenza/<paziente_id>', methods=['DELETE'])
def elimina_residenza(paziente_id):
    """
    Elimina la residenza di un paziente
    ---
    tags:
      - Residenze
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Residenza eliminata
    """
    return residenzactrl.elimina_residenza(paziente_id)