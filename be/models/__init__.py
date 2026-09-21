# be/models/__init__.py
# Importa tutti i modelli per assicurare che siano registrati da SQLAlchemy
from . import paziente_model  
from . import residenza_model  
from . import contatti_model  
from . import analisi_psico_sociale  
from . import farmaci_allergie  
# aggiungi qui gli altri modelli se necessario