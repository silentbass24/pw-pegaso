import be.controller.appuntamento_controller as appuntamento_controller
from flask import Flask, Blueprint, request
from be.services.appuntamento_service import AppuntamentoService



api = Blueprint('appuntamento_api', __name__, url_prefix='/api')
appuntamentocontroller = appuntamento_controller.AppuntamentoController(AppuntamentoService())

'''API RESTful per la gestione degli appuntamenti.'''
@api.route('/appuntamenti', methods=['GET'])
def get_appuntamenti():
    """
    Recupera tutti gli appuntamenti
    ---
    tags:
      - Appuntamenti
    responses:
      200:
        description: Lista degli appuntamenti
        schema:
          type: array
          items:
            $ref: '#/definitions/AppuntamentoResponseDTO'
    """
    return appuntamentocontroller.get_appuntamenti()
  
@api.route('/appuntamenti-dettagli', methods=['GET'])
def get_appuntamenti_dettagli():
    """
    Recupera tutti gli appuntamenti con dettagli
    ---
    tags:
      - Appuntamenti
    responses:
      200:
        description: Lista degli appuntamenti con dettagli
        schema:
          type: array
          items:
            $ref: '#/definitions/AppuntamentoConDettagliResponseDTO'
    """
    return appuntamentocontroller.get_appuntamenti_dettagli()


@api.route('/appuntamenti/<appuntamento_id>', methods=['GET'])
def get_appuntamento_by_id(appuntamento_id):
    """
    Recupera un appuntamento specifico
    ---
    tags:
      - Appuntamenti
    parameters:
      - name: appuntamento_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Appuntamento trovato
        schema:
          $ref: '#/definitions/AppuntamentoResponseDTO'
    """
    return appuntamentocontroller.get_appuntamento_by_id(appuntamento_id)

@api.route('/nuovo-appuntamento', methods=['POST'])
def nuovo_appuntamento():
    """
    Crea un nuovo appuntamento
    ---
    tags:
      - Appuntamenti
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaAppuntamentoDTO'
    responses:
      201:
        description: Appuntamento creato
        schema:
          $ref: '#/definitions/AppuntamentoResponseDTO'
    """
    appuntamento_data = request.get_json()
    return appuntamentocontroller.nuovo_appuntamento(appuntamento_data)

@api.route('/aggiorna-appuntamento/<appuntamento_id>', methods=['PUT'])
def aggiorna_appuntamento(appuntamento_id):
    """
    Aggiorna un appuntamento esistente
    ---
    tags:
      - Appuntamenti
    parameters:
      - name: appuntamento_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaAppuntamentoDTO'
    responses:
      200:
        description: Appuntamento aggiornato
        schema:
          $ref: '#/definitions/AppuntamentoResponseDTO'
    """
    appuntamento_data = request.get_json()
    return appuntamentocontroller.aggiorna_appuntamento(appuntamento_id, appuntamento_data)

@api.route('/elimina-appuntamento/<appuntamento_id>', methods=['DELETE'])
def elimina_appuntamento(appuntamento_id):
    """
    Elimina un appuntamento esistente
    ---
    tags:
      - Appuntamenti
    parameters:
      - name: appuntamento_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Appuntamento eliminato
    """
    return appuntamentocontroller.elimina_appuntamento(appuntamento_id)