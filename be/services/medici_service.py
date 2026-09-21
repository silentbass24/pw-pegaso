from be.models.medico_model import Medico
from be.dto.medico_dto import MedicoResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class MediciService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_medici(self):
        with self.dbobject.sessione("public") as db:
            medici = db.query(Medico).all()
            return MedicoResponseDTO(many=True).dump(medici)
            
    def get_medico_by_id(self, medico_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'medico', 'id', medico_id):
                ut.write_error_log(f"Medico con ID {medico_id} non trovato")
                return None
            medico = db.query(Medico).filter(Medico._id == medico_id).first()
            if medico:
                return MedicoResponseDTO().dump(medico)
            else:
                return None
            
    def nuovo_medico(self, medico_data):
        with self.dbobject.sessione("public") as db:
            nuovo_medico = Medico(**medico_data)
            db.add(nuovo_medico)
            db.flush()
            return MedicoResponseDTO().dump(nuovo_medico)
            
    def aggiorna_medico(self, medico_id, medico_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'medico', 'id', medico_id):
                ut.write_error_log(f"Medico con ID {medico_id} non trovato")
                return None
            medico = db.query(Medico).filter(Medico._id == medico_id).first()
            if medico:
                for key, value in medico_data.items():
                    setattr(medico, key, value)
                db.flush()
                db.refresh(medico)
                return MedicoResponseDTO().dump(medico)
            else:
                ut.write_error_log(f"Medico con ID {medico_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_medico(self, medico_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'medico', 'id', medico_id):
                ut.write_error_log(f"Medico con ID {medico_id} non trovato durante l'eliminazione")
                return False
            medico = db.query(Medico).filter(Medico._id == medico_id).first()
            if medico:
                db.delete(medico)
                return True
            else:
                ut.write_error_log(f"Medico con ID {medico_id} non trovato durante l'eliminazione")
                return False