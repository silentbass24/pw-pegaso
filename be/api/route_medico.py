import be.controller.medici_controller as medico_controller
from flask import Flask, Blueprint, request
from be.services.medici_service import MediciService



api = Blueprint('medico_api', __name__, url_prefix='/api')
medicocontroller = medico_controller.MediciController(MediciService())

'''API RESTful per la gestione dei medici.'''
@api.route('/medici', methods=['GET'])
def get_medici():
    """
    Recupera tutti i medici
    ---
    tags:
      - Medici
    responses:
      200:
        description: Lista di medici
        schema:
          type: array
          items:
            $ref: '#/definitions/MedicoResponseDTO'
    """
    return medicocontroller.get_medici()


@api.route('/medici/<medico_id>', methods=['GET'])
def get_medico_by_id(medico_id):
    """
    Recupera un medico specifico
    ---
    tags:
      - Medici
    parameters:
      - name: medico_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Medico trovato
        schema:
          $ref: '#/definitions/MedicoResponseDTO'
    """
    return medicocontroller.get_medico_by_id(medico_id)

@api.route('/nuovo-medico', methods=['POST'])
def nuovo_medico():
    """
    Crea un nuovo medico
    ---
    tags:
      - Medici
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaMedicoDTO'
    responses:
      201:
        description: Medico creato
        schema:
          $ref: '#/definitions/MedicoResponseDTO'
    """
    medico_data = request.get_json()
    return medicocontroller.nuovo_medico(medico_data)

@api.route('/aggiorna-medico/<medico_id>', methods=['PUT'])
def aggiorna_medico(medico_id):
    """
    Aggiorna un medico
    ---
    tags:
      - Medici
    parameters:
      - name: medico_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaMedicoDTO'
    responses:
      200:
        description: Medico aggiornato
        schema:
          $ref: '#/definitions/MedicoResponseDTO'
    """
    medico_data = request.get_json()
    return medicocontroller.aggiorna_medico(medico_id, medico_data)

@api.route('/elimina-medico/<medico_id>', methods=['DELETE'])
def elimina_medico(medico_id):
    """
    Elimina un medico
    ---
    tags:
      - Medici
    parameters:
      - name: medico_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Medico eliminato
    """
    return medicocontroller.elimina_medico(medico_id)