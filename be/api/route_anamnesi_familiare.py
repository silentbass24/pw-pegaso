import be.controller.anamnesi_familiare_controller as anamnesi_familiare_controller
from flask import Flask, Blueprint, request
from be.services.anamnesi_familiare_service import AnamnesiFamiliareService



api = Blueprint('anamnesi_familiare_api', __name__, url_prefix='/api')
anamnesictrl = anamnesi_familiare_controller.AnamnesiFamiliareController(AnamnesiFamiliareService())

'''API RESTful per la gestione delle anamnesi familiari. Include endpoint per creare, leggere, aggiornare ed eliminare le anamnesi familiari.'''
@api.route('/anamnesi-familiare', methods=['GET'])
def get_anamnesi():
    """
    Recupera tutte le anamnesi familiari
    ---
    tags:
      - Anamnesi Familiare
    responses:
      200:
        description: Lista delle anamnesi familiari
        schema:
          type: array
          items:
            $ref: '#/definitions/AnamnesiFamiliareResponseDTO'
    """
    return anamnesictrl.get_anamnesi()


@api.route('/anamnesi-familiare/<anamnesi_id>', methods=['GET'])
def get_anamnesi_by_id(anamnesi_id):
    """
    Recupera un'anamnesi familiare specifica
    ---
    tags:
      - Anamnesi Familiare
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi familiare trovata
        schema:
          $ref: '#/definitions/AnamnesiFamiliareResponseDTO'
    """
    return anamnesictrl.get_anamnesi_by_id(anamnesi_id)

@api.route('/nuova-anamnesi-familiare', methods=['POST'])
def nuova_anamnesi():
    """
    Crea una nuova anamnesi familiare
    ---
    tags:
      - Anamnesi Familiare
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaAnamnesiFamiliareDTO'
    responses:
      201:
        description: Anamnesi familiare creata
        schema:
          $ref: '#/definitions/AnamnesiFamiliareResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.nuova_anamnesi(anamnesi_data)

@api.route('/aggiorna-anamnesi-familiare/<anamnesi_id>', methods=['PUT'])
def aggiorna_anamnesi(anamnesi_id):
    """
    Aggiorna un'anamnesi familiare
    ---
    tags:
      - Anamnesi Familiare
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaAnamnesiFamiliareDTO'
    responses:
      200:
        description: Anamnesi familiare aggiornata
        schema:
          $ref: '#/definitions/AnamnesiFamiliareResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.aggiorna_anamnesi(anamnesi_id, anamnesi_data)

@api.route('/elimina-anamnesi-familiare/<anamnesi_id>', methods=['DELETE'])
def elimina_anamnesi(anamnesi_id):
    """
    Elimina un'anamnesi familiare
    ---
    tags:
      - Anamnesi Familiare
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi familiare eliminata
    """
    return anamnesictrl.elimina_anamnesi(anamnesi_id)