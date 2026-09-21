from be.models.residenza_model import Residenza
from be.dto.residenza_dto import ResidenzaResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut
from sqlalchemy.exc import IntegrityError

class ResidenzaService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_residenze(self):
        with self.dbobject.sessione("public") as db:
            residenza = db.query(Residenza).all()
            return ResidenzaResponseDTO(many=True).dump(residenza)
            
    def get_residenza_by_id(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'residenza', 'id_paziente', paziente_id):
                ut.write_error_log(f"Residenza con ID paziente {paziente_id} non trovato")
                return None
            residenza = db.query(Residenza).filter(Residenza._id_paziente == paziente_id).first()
            if residenza:
                return ResidenzaResponseDTO().dump(residenza)
            else:
                return None
            
    def nuova_residenza(self, residenza_data):
        with self.dbobject.sessione("public") as db:
            if self.dbobject.ControllaEsistenza(db, 'residenza', 'id_paziente', residenza_data['id_paziente']):
                ut.write_error_log(f"Residenza già esistente per {residenza_data['id_paziente']}")
                return None
            try:
                nuova_residenza = Residenza(**residenza_data)
                db.add(nuova_residenza)
                db.flush()
                return ResidenzaResponseDTO().dump(nuova_residenza)
            except IntegrityError as e:
                db.rollback()
                ut.write_error_log(f"IntegrityError creazione residenza: {e}")
                return None
            
    def aggiorna_residenza(self, paziente_id, residenza_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'residenza', 'id_paziente', paziente_id):
                ut.write_error_log(f"Residenza con ID paziente {paziente_id} non trovato")
                return None
            residenza = db.query(Residenza).filter(Residenza._id_paziente == paziente_id).first()
            if residenza:
                for key, value in residenza_data.items():
                    setattr(residenza, key, value)
                db.flush()
                db.refresh(residenza)
                return ResidenzaResponseDTO().dump(residenza)
            else:
                ut.write_error_log(f"Residenza con ID paziente {paziente_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_residenza(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'residenza', 'id_paziente', paziente_id):
                ut.write_error_log(f"Residenza con ID paziente {paziente_id} non trovato durante l'eliminazione")
                return False
            residenza = db.query(Residenza).filter(Residenza._id_paziente == paziente_id).first()
            if residenza:
                db.delete(residenza)
                return True
            else:
                ut.write_error_log(f"Residenza con ID paziente {paziente_id} non trovato durante l'eliminazione")
                return False