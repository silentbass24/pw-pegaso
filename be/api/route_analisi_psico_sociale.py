import be.controller.analisi_psico_sociale_controller as analisi_controller
from flask import Flask, Blueprint, request
from be.services.ananlisi_psico_sociale_service import AnalisiPsicoSocialeService



api = Blueprint('analisi_api', __name__, url_prefix='/api')
analisictrl = analisi_controller.AnalisiPsicoSocialeController(AnalisiPsicoSocialeService())

'''API RESTful per la gestione delle analisi psico-sociali. Include endpoint per creare, leggere, aggiornare ed eliminare le analisi psico-sociali.'''
@api.route('/analisi', methods=['GET'])
def get_analisi():
    """
    Recupera tutte le analisi psico-sociali
    ---
    tags:
      - Analisi Psico-Sociale
    responses:
      200:
        description: Lista delle analisi psico-sociali
        schema:
          type: array
          items:
            $ref: '#/definitions/AnalisiPsicoSocialeResponseDTO'
    """
    return analisictrl.get_analisi()


@api.route('/analisi/<analisi_id>', methods=['GET'])
def get_analisi_by_id(analisi_id):
    """
    Recupera un'analisi psico-sociale specifica
    ---
    tags:
      - Analisi Psico-Sociale
    parameters:
      - name: analisi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Analisi psico sociale trovata
        schema:
          $ref: '#/definitions/AnalisiPsicoSocialeResponseDTO'
    """
    return analisictrl.get_analisi_by_id(analisi_id)

@api.route('/nuova-analisi', methods=['POST'])
def nuovo_analisi():
    """
    Crea una nuova analisi psico-sociale
    ---
    tags:
      - Analisi Psico-Sociale
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/CreaAnalisiPsicoSocialeDTO'
    responses:
      201:
        description: Analisi psico-sociale creata
        schema:
          $ref: '#/definitions/AnalisiPsicoSocialeResponseDTO'
    """
    analisi_data = request.get_json()
    return analisictrl.nuovo_analisi(analisi_data)

@api.route('/aggiorna-analisi/<analisi_id>', methods=['PUT'])
def aggiorna_analisi(analisi_id):
    """
    Aggiorna un'analisi psico-sociale
    ---
    tags:
      - Analisi Psico-Sociale
    parameters:
      - name: analisi_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/AggiornaAnalisiPsicoSocialeDTO'
    responses:
      200:
        description: Analisi psico-sociale aggiornata
        schema:
          $ref: '#/definitions/AnalisiPsicoSocialeResponseDTO'
    """
    analisi_data = request.get_json()
    return analisictrl.aggiorna_analisi(analisi_id, analisi_data)

@api.route('/elimina-analisi/<analisi_id>', methods=['DELETE'])
def elimina_analisi(analisi_id):
    """
    Elimina un'analisi psico-sociale
    ---
    tags:
      - Analisi Psico-Sociale
    parameters:
      - name: analisi_id
        in: path
        required: true
        type: string
    responses:
      200:
        description: Analisi psico-sociale eliminata
    """
    return analisictrl.elimina_analisi(analisi_id)