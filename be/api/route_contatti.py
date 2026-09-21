import be.controller.contatti_controller as contatti_controller
from flask import Flask, Blueprint, request
from be.services.contatti_service import ContattiService



api = Blueprint('contatti_api', __name__, url_prefix='/api')
contattictrl = contatti_controller.ContattiController(ContattiService())

'''API RESTful per la gestione dei contatti dei pazienti.'''
@api.route('/contatti', methods=['GET'])
def get_contatti():
    """
    Recupera tutti i contatti dei pazienti
    ---
    tags:
      - Contatti
    responses:
      200:
        description: Lista dei contatti dei pazienti
        schema:
          type: array
          items:
            $ref: '#/definitions/ContattiResponseDTO'
    """
    return contattictrl.get_contatti()


@api.route('/contatti/<paziente_id>', methods=['GET'])
def get_contatti_by_id(paziente_id):
    """
    Recupera i contatti di un paziente specifico
    ---
    tags:
      - Contatti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Contatti trovati
        schema:
          $ref: '#/definitions/ContattiResponseDTO'
    """
    return contattictrl.get_contatti_by_id(paziente_id)

@api.route('/nuovo-contatto', methods=['POST'])
def nuovo_paziente():
    """
    Crea un nuovo contatto per il paziente
    ---
    tags:
      - Contatti
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaContattiDTO'
    responses:
      201:
        description: Contatto creato
        schema:
          $ref: '#/definitions/ContattiResponseDTO'
    """
    contatti_data = request.get_json()
    return contattictrl.nuovo_contatto(contatti_data)

@api.route('/aggiorna-contatti/<paziente_id>', methods=['PUT'])
def aggiorna_contatti(paziente_id):
    """
    Aggiorna i contatti di un paziente
    ---
    tags:
      - Contatti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaContattiDTO'
    responses:
      200:
        description: Contatto aggiornato
        schema:
          $ref: '#/definitions/ContattiResponseDTO'
    """
    contatti_data = request.get_json()
    return contattictrl.aggiorna_contatto(paziente_id, contatti_data)

@api.route('/elimina-contatto/<paziente_id>', methods=['DELETE'])
def elimina_contatto(paziente_id):
    """
    Elimina il contatto di un paziente
    ---
    tags:
      - Contatti
    parameters:
      - name: paziente_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Contatto eliminato
    """
    return contattictrl.elimina_contatto(paziente_id)