import be.controller.farmaci_allergie_controller as farmaci_allergie_controller
from flask import Flask, Blueprint, request
from be.services.farmaci_allergie_service import FarmaciAllergieService



api = Blueprint('farmaci_allergie_api', __name__, url_prefix='/api')
farmaci_allergie_ctrl = farmaci_allergie_controller.FarmaciAllergieController(FarmaciAllergieService())

'''API RESTful per la gestione dei farmaci e allergie. Include endpoint per creare, leggere, aggiornare ed eliminare i farmaci e allergie.'''
@api.route('/farmaci-allergie', methods=['GET'])
def get_farmaci_allergie():
    """
    Recupera tutti i farmaci e allergie
    ---
    tags:
      - Farmaci e Allergie
    responses:
      200:
        description: Lista dei farmaci e allergie
        schema:
          type: array
          items:
            $ref: '#/definitions/FarmaciAllergieResponseDTO'
    """
    return farmaci_allergie_ctrl.get_farmaci_allergie()


@api.route('/farmaci-allergie/<farmaci_allergie_id>', methods=['GET'])
def get_farmaci_allergie_by_id(farmaci_allergie_id):
    """
    Recupera un farmaco o un'allergia specifica
    ---
    tags:
      - Farmaci e Allergie
    parameters:
      - name: farmaci_allergie_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Farmaco o allergia trovata
        schema:
          $ref: '#/definitions/FarmaciAllergieResponseDTO'
    """
    return farmaci_allergie_ctrl.get_farmaci_allergie_by_id(farmaci_allergie_id)

@api.route('/nuova-farmaci-allergie', methods=['POST'])
def nuova_farmaci_allergie():
    """
    Crea un nuovo farmaco o allergia
    ---
    tags:
      - Farmaci e Allergie
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/FarmaciAllergieDTO'
    responses:
      201:
        description: Farmaco o allergia creata
        schema:
          $ref: '#/definitions/FarmaciAllergieResponseDTO'
    """
    farmaci_allergie_data = request.get_json()
    return farmaci_allergie_ctrl.nuova_farmaci_allergie(farmaci_allergie_data)

@api.route('/aggiorna-farmaci-allergie/<farmaci_allergie_id>', methods=['PUT'])
def aggiorna_farmaci_allergie(farmaci_allergie_id):
    """
    Aggiorna un farmaco o un'allergia
    ---
    tags:
      - Farmaci e Allergie
    parameters:
      - name: farmaci_allergie_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaFarmaciAllergieDTO'
    responses:
      200:
        description: Farmaco o allergia aggiornata
        schema:
          $ref: '#/definitions/FarmaciAllergieResponseDTO'
    """
    farmaci_allergie_data = request.get_json()
    return farmaci_allergie_ctrl.aggiorna_farmaci_allergie(farmaci_allergie_id, farmaci_allergie_data)

@api.route('/elimina-farmaci-allergie/<farmaci_allergie_id>', methods=['DELETE'])
def elimina_farmaci_allergie(farmaci_allergie_id):
    """
    Elimina un farmaco o un'allergia
    ---
    tags:
      - Farmaci e Allergie
    parameters:
      - name: farmaci_allergie_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Farmaco o allergia eliminata
    """
    return farmaci_allergie_ctrl.elimina_farmaci_allergie(farmaci_allergie_id)