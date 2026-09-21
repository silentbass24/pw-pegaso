import re
from marshmallow import validate, ValidationError


def validate_nome(value):
    if value.strip() == "":
        raise ValidationError("Il nome non può essere vuoto")
    if not re.match(r"^[a-zA-ZÀ-ÿ ']+$", value):
        raise ValidationError("Il nome non può contenere caratteri speciali o numeri")
    
def validate_cognome(value):
    if value.strip() == "":
        raise ValidationError("Il cognome non può essere vuoto")
    if not re.match(r"^[a-zA-ZÀ-ÿ ']+$", value):
        raise ValidationError("Il cognome non può contenere caratteri speciali o numeri")
    
def validate_codice_fiscale(value):
    if value.strip() == "":
        raise ValidationError("Il codice fiscale non può essere vuoto")
    if len(value) != 16:
        raise ValidationError("Il codice fiscale deve essere lungo 16 caratteri")
    if not re.match(r"^[A-Z0-9]+$", value):
        raise ValidationError("Il codice fiscale deve contenere solo lettere maiuscole e numeri")
    
def validate_indirizzo(value):
    if value.strip() == "":
        raise ValidationError("L'indirizzo non può essere vuoto")
    if not re.match(r"^[a-zA-ZÀ-ÿ0-9 './]+$", value):
        raise ValidationError("L'indirizzo non può contenere caratteri speciali")

def validate_civico(value):
    if value.strip() == "":
        raise ValidationError("Il numero civico non può essere vuoto")
    if not re.match(r"^[^<>]{1,10}$", value):
        raise ValidationError("Il numero civico non può contenere caratteri speciali")
    
def validate_data(value):
    if not re.match(r"^\d{2}-\d{2}-\d{4}$", value):
        raise ValidationError("La data deve essere nel formato DD-MM-YYYY")
    
def validate_note(value):
    if not re.match(r"^[a-zA-ZÀ-ÿ0-9 .,!?'-]+$", value):
        raise ValidationError("Le note non possono contenere caratteri speciali")