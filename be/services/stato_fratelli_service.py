from be.models.stato_fratelli import StatoFratelli
from be.dto.stato_fratelli_dto import StatoFratelliDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut
    
class StatoFratelliService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_stato_fratelli(self):
        with self.dbobject.sessione("anamnesi") as db:
            stato_fratelli = db.query(StatoFratelli).all()
            return StatoFratelliDTO(many=True).dump(stato_fratelli)
            
    def get_stato_fratelli_by_id(self, stato_fratelli_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_fratelli', 'id', stato_fratelli_id):
                ut.write_error_log(f"Stato Fratelli con ID {stato_fratelli_id} non trovato")
                return None
            stato_fratelli = db.query(StatoFratelli).filter(StatoFratelli._id == stato_fratelli_id).first()
            if stato_fratelli:
                return StatoFratelliDTO().dump(stato_fratelli)
            else:
                return None
            
    def nuovo_stato_fratelli(self, stato_fratelli_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuovo_stato_fratelli = StatoFratelli(**stato_fratelli_data)
            db.add(nuovo_stato_fratelli)
            db.flush()
            return StatoFratelliDTO().dump(nuovo_stato_fratelli)
            
    def aggiorna_stato_fratelli(self, stato_fratelli_id, stato_fratelli_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_fratelli', 'id', stato_fratelli_id):
                ut.write_error_log(f"Stato Fratelli con ID {stato_fratelli_id} non trovato")
                return None
            stato_fratelli = db.query(StatoFratelli).filter(StatoFratelli._id == stato_fratelli_id).first()
            if stato_fratelli:
                for key, value in stato_fratelli_data.items():
                    setattr(stato_fratelli, key, value)
                db.flush()
                db.refresh(stato_fratelli)
                return StatoFratelliDTO().dump(stato_fratelli)
            else:
                ut.write_error_log(f"Stato Fratelli con ID {stato_fratelli_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_stato_fratelli(self, stato_fratelli_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'stato_fratelli', 'id', stato_fratelli_id):
                ut.write_error_log(f"Stato Fratelli con ID {stato_fratelli_id} non trovato durante l'eliminazione")
                return False
            stato_fratelli = db.query(StatoFratelli).filter(StatoFratelli._id == stato_fratelli_id).first()
            if stato_fratelli:
                db.delete(stato_fratelli)
                return True
            else:
                ut.write_error_log(f"Stato Fratelli con ID {stato_fratelli_id} non trovato durante l'eliminazione")
                return False