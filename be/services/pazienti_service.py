from be.models.paziente_model import Paziente
from be.dto.paziente_dto import PazienteResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class PazientiService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_pazienti(self):
        with self.dbobject.sessione("public") as db:
            pazienti = db.query(Paziente).all()
            return PazienteResponseDTO(many=True).dump(pazienti)
            
    def get_paziente_by_id(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'paziente', 'id', paziente_id):
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato")
                return None
            paziente = db.query(Paziente).filter(Paziente._id == paziente_id).first()
            if paziente:
                return PazienteResponseDTO().dump(paziente)
            else:
                return None
            
    def nuovo_paziente(self, paziente_data):
        with self.dbobject.sessione("public") as db:
            nuovo_paziente = Paziente(**paziente_data)
            db.add(nuovo_paziente)
            db.flush()
            return PazienteResponseDTO().dump(nuovo_paziente)
            
    def aggiorna_paziente(self, paziente_id, paziente_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'paziente', 'id', paziente_id):
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato")
                return None
            paziente = db.query(Paziente).filter(Paziente._id == paziente_id).first()
            if paziente:
                for key, value in paziente_data.items():
                    setattr(paziente, key, value)
                db.flush()
                db.refresh(paziente)
                return PazienteResponseDTO().dump(paziente)
            else:
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_paziente(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'paziente', 'id', paziente_id):
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato durante l'eliminazione")
                return False
            paziente = db.query(Paziente).filter(Paziente._id == paziente_id).first()
            if paziente:
                db.delete(paziente)
                return True
            else:
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato durante l'eliminazione")
                return False