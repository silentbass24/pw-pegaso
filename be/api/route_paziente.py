import be.controller.pazienti_controller as pazienti_controller
from flask import Flask, Blueprint, request
from be.services.pazienti_service import PazientiService
from be.core.auth_middleware import require_auth
from be.core.auth_middleware import require_privileges

api = Blueprint('pazienti_api', __name__, url_prefix='/api')
pazientictrl = pazienti_controller.PazientiController(PazientiService())

'''API RESTful per la gestione dei pazienti.'''
@api.route('/pazienti', methods=['GET'])
# @require_auth
# @require_privileges(is_admin=True, is_doctor=True)
def get_pazienti():
    """
    Recupera tutti i pazienti
    ---
    tags:
      - Pazienti
    responses:
      200:
        description: Lista di pazienti
        schema:
          type: array
          items:
            $ref: '#/definitions/PazienteResponseDTO'
    """
    return pazientictrl.get_pazienti()


@api.route('/pazienti/<paziente_id>', methods=['GET'])
# @require_auth
# @require_privileges(is_admin=True, is_doctor=True)
def get_paziente_by_id(paziente_id):
    """
    Recupera un paziente specifico
    ---
    tags:
      - Pazienti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Paziente trovato
        schema:
          $ref: '#/definitions/PazienteResponseDTO'
    """
    return pazientictrl.get_paziente_by_id(paziente_id)

@api.route('/nuovo-paziente', methods=['POST','OPTIONS'])
#@require_auth
#@require_privileges(is_admin=True, is_doctor=True)
def nuovo_paziente():
    """
    Crea un nuovo paziente
    ---
    tags:
      - Pazienti
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaPazienteDTO'
    responses:
      201:
        description: Paziente creato
        schema:
          $ref: '#/definitions/PazienteResponseDTO'
    """
    if request.method == 'OPTIONS':
      return '', 200 
    paziente_data = request.get_json()
    return pazientictrl.nuovo_paziente(paziente_data)

@api.route('/aggiorna-paziente/<paziente_id>', methods=['PUT'])
# @require_auth
# @require_privileges(is_admin=True, is_doctor=True)
def aggiorna_paziente(paziente_id):
    """
    Aggiorna un paziente
    ---
    tags:
      - Pazienti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaPazienteDTO'
    responses:
      200:
        description: Paziente aggiornato
        schema:
          $ref: '#/definitions/PazienteResponseDTO'
    """
    paziente_data = request.get_json()
    return pazientictrl.aggiorna_paziente(paziente_id, paziente_data)

@api.route('/elimina-paziente/<paziente_id>', methods=['DELETE'])
# @require_auth
# @require_privileges(is_admin=True, is_doctor=True)
def elimina_paziente(paziente_id):
    """
    Elimina un paziente
    ---
    tags:
      - Pazienti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Paziente eliminato
    """
    return pazientictrl.elimina_paziente(paziente_id)