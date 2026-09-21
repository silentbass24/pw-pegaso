from be.models.stato_genitori import StatoGenitori
from be.dto.stato_genitori_dto import StatoGenitoriDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut
    
class StatoGenitoriService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_stato_genitori(self):
        with self.dbobject.sessione("anamnesi") as db:
            stato_genitori = db.query(StatoGenitori).all()
            return StatoGenitoriDTO(many=True).dump(stato_genitori)
            
    def get_stato_genitori_by_id(self, stato_genitori_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_genitori', 'id', stato_genitori_id):
                ut.write_error_log(f"Stato Genitori con ID {stato_genitori_id} non trovato")
                return None
            stato_genitori = db.query(StatoGenitori).filter(StatoGenitori._id == stato_genitori_id).first()
            if stato_genitori:
                return StatoGenitoriDTO().dump(stato_genitori)
            else:
                return None
            
    def nuovo_stato_genitori(self, stato_genitori_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuovo_stato_genitori = StatoGenitori(**stato_genitori_data)
            db.add(nuovo_stato_genitori)
            db.flush()
            return StatoGenitoriDTO().dump(nuovo_stato_genitori)
            
    def aggiorna_stato_genitori(self, stato_genitori_id, stato_genitori_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_genitori', 'id', stato_genitori_id):
                ut.write_error_log(f"Stato Genitori con ID {stato_genitori_id} non trovato")
                return None
            stato_genitori = db.query(StatoGenitori).filter(StatoGenitori._id == stato_genitori_id).first()
            if stato_genitori:
                for key, value in stato_genitori_data.items():
                    setattr(stato_genitori, key, value)
                db.flush()
                db.refresh(stato_genitori)
                return StatoGenitoriDTO().dump(stato_genitori)
            else:
                ut.write_error_log(f"Stato Genitori con ID {stato_genitori_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_stato_genitori(self, stato_genitori_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_genitori', 'id', stato_genitori_id):
                ut.write_error_log(f"Stato Genitori con ID {stato_genitori_id} non trovato durante l'eliminazione")
                return False
            stato_genitori = db.query(StatoGenitori).filter(StatoGenitori._id == stato_genitori_id).first()
            if stato_genitori:
                db.delete(stato_genitori)
                return True
            else:
                ut.write_error_log(f"Stato Genitori con ID {stato_genitori_id} non trovato durante l'eliminazione")
                return False