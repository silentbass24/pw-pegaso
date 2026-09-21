import be.controller.anamnesi_patologica_remota_controller as anamnesi_patologica_remota_controller
from flask import Flask, Blueprint, request
from be.services.anamnesi_patologica_remota_service import AnamnesiPatologicaRemotaService



api = Blueprint('anamnesi_patologica_remota_api', __name__, url_prefix='/api')
anamnesictrl = anamnesi_patologica_remota_controller.AnamnesiPatologicaRemotaController(AnamnesiPatologicaRemotaService())

'''API RESTful per la gestione delle anamnesi patologiche remote. Include endpoint per creare, leggere, aggiornare ed eliminare le anamnesi patologiche remote.'''
@api.route('/anamnesi-patologica-remota', methods=['GET'])
def get_anamnesi():
    """
    Recupera tutte le anamnesi patologiche remote
    ---
    tags:
      - Anamnesi Patologica Remota
    responses:
      200:
        description: Lista delle anamnesi patologiche remote
        schema:
          type: array
          items:
            $ref: '#/definitions/AnamnesiPatologicaRemotaResponseDTO'
    """
    return anamnesictrl.get_anamnesi()


@api.route('/anamnesi-patologica-remota/<anamnesi_id>', methods=['GET'])
def get_anamnesi_by_id(anamnesi_id):
    """
    Recupera un'anamnesi patologica remota specifica
    ---
    tags:
      - Anamnesi Patologica Remota
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi patologica remota trovata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaRemotaResponseDTO'
    """
    return anamnesictrl.get_anamnesi_by_id(anamnesi_id)

@api.route('/nuova-anamnesi-patologica-remota', methods=['POST'])
def nuova_anamnesi():
    """
    Crea una nuova anamnesi patologica remota
    ---
    tags:
      - Anamnesi Patologica Remota
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaAnamnesiPatologicaRemotaDTO'
    responses:
      201:
        description: Anamnesi patologica remota creata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaRemotaResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.nuova_anamnesi(anamnesi_data)

@api.route('/aggiorna-anamnesi-patologica-remota/<anamnesi_id>', methods=['PUT'])
def aggiorna_anamnesi(anamnesi_id):
    """
    Aggiorna un'anamnesi patologica remota
    ---
    tags:
      - Anamnesi Patologica Remota
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaAnamnesiPatologicaRemotaDTO'
    responses:
      200:
        description: Anamnesi patologica remota aggiornata
        schema:
          $ref: '#/definitions/AnamnesiPatologicaRemotaResponseDTO'
    """
    anamnesi_data = request.get_json()
    return anamnesictrl.aggiorna_anamnesi(anamnesi_id, anamnesi_data)

@api.route('/elimina-anamnesi-patologica-remota/<anamnesi_id>', methods=['DELETE'])
def elimina_anamnesi(anamnesi_id):
    """
    Elimina un'anamnesi patologica remota
    ---
    tags:
      - Anamnesi Patologica Remota
    parameters:
      - name: anamnesi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Anamnesi patologica remota eliminata
    """
    return anamnesictrl.elimina_anamnesi(anamnesi_id)