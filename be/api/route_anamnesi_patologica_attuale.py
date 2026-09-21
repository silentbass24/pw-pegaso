import be.controller.anamnesi_patologica_attuale_controller as anamnesi_patologica_attuale_controller
from flask import Flask, Blueprint, request
from be.services.anamnesi_patologica_attuale_service import AnamnesiPatologicaAttualeService



api = Blueprint('anamnesi_patologica_attuale_api', __name__, url_prefix='/api')
anamnesictrl = anamnesi_patologica_attuale_controller.AnamnesiPatologicaAttualeController(AnamnesiPatologicaAttualeService())

'''API RESTful per la gestione delle anamnesi patologiche attuali. Include endpoint per creare, leggere, aggiornare ed eliminare le anamnesi patologiche attuali.'''
@api.route('/anamnesi-patologica-attuale', methods=['GET'])
def get_anamnesi():
    """
    Recupera tutte le anamnesi patologiche attuali
    ---
    tags:
      - Anamnesi Patologica Attuale
    responses:
      200:
        description: Lista delle anamnesi patologiche attuali
        schema:
          type: array
          items:
            $ref: '#/definitions/AnamnesiPatologicaAttualeResponseDTO'
    """
    return anamnesictrl.get_anamnesi()


@api.route('/anamnesi-patologica-attuale/<anamnesi_id>', methods=['GET'])
def get_anamnesi_by_id(anamnesi_id):
    """
    Recupera un'anamnesi patologica attuale specifica
    ---
    tags:
      - Anamnesi Patologica Attuale
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi patologica attuale trovata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaAttualeResponseDTO'
    """
    return anamnesictrl.get_anamnesi_by_id(anamnesi_id)

@api.route('/nuova-anamnesi-patologica-attuale', methods=['POST'])
def nuova_anamnesi():
    """
    Crea una nuova anamnesi patologica attuale
    ---
    tags:
      - Anamnesi Patologica Attuale
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaAnamnesiPatologicaAttualeDTO'
    responses:
      201:
        description: Anamnesi patologica attuale creata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaAttualeResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.nuova_anamnesi(anamnesi_data)

@api.route('/aggiorna-anamnesi-patologica-attuale/<anamnesi_id>', methods=['PUT'])
def aggiorna_anamnesi(anamnesi_id):
    """
    Aggiorna un'anamnesi patologica attuale
    ---
    tags:
      - Anamnesi Patologica Attuale
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaAnamnesiPatologicaAttualeDTO'
    responses:
      200:
        description: Anamnesi patologica attuale aggiornata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaAttualeResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.aggiorna_anamnesi(anamnesi_id, anamnesi_data)

@api.route('/elimina-anamnesi-patologica-attuale/<anamnesi_id>', methods=['DELETE'])
def elimina_anamnesi(anamnesi_id):
    """
    Elimina un'anamnesi patologica attuale
    ---
    tags:
      - Anamnesi Patologica Attuale
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi patologica attuale eliminata
    """
    return anamnesictrl.elimina_anamnesi(anamnesi_id)