from flask import Flask
from be.api.swagger_defs import get_swagger_definitions
import be.core.config as config
from flasgger import Swagger
from flask_cors import CORS

template = {
    "swagger": "2.0",
    "info": {
        "title": "API Project work",
        "description": "API RESTful per la gestione delle funzionalità del progetto",
        "version": "1.0.0"
    },
    "basePath": "/api",
    "schemes": [
        "http",
        "https"
    ],
    "definitions": get_swagger_definitions()
}

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    Swagger(app, template=template)

    from be.api.route_paziente import api as pazienti_api
    from be.api.route_contatti import api as contatti_api
    from be.api.route_residenza import api as residenza_api
    from be.api.route_medico import api as medico_api
    from be.api.route_slot import api as slot_api
    from be.api.route_appuntamento import api as appuntamento_api
    from be.api.route_analisi_psico_sociale import api as analisi_psico_sociale_api
    from be.api.route_anamnesi_familiare import api as anamnesi_familiare_api
    from be.api.route_anamnesi_patologica_attuale import api as anamnesi_patologica_attuale_api
    from be.api.route_anamnesi_patologica_remota import api as anamnesi_patologica_remota_api
    from be.api.route_farmaci_allergie import api as farmaci_allergie_api
    from be.api.route_stato_fratelli import api as stato_fratelli_api
    from be.api.route_stato_genitori import api as stato_genitori_api
    from be.api.route_auth import api as auth_api

    for bp in (pazienti_api, 
               contatti_api, 
               residenza_api,
               medico_api,
               slot_api,
               appuntamento_api,
               analisi_psico_sociale_api,
               anamnesi_familiare_api,
               anamnesi_patologica_attuale_api,
               anamnesi_patologica_remota_api,
               farmaci_allergie_api,
               stato_fratelli_api,
               stato_genitori_api,
               auth_api):
        app.register_blueprint(bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=config.IS_DEBUG, host=config.HOST, port=config.SERVER_PORT)