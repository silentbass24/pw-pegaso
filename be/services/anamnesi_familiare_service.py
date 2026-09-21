from be.models.anamnesi_familiare import AnamnesiFamiliare
from be.dto.anamnesi_familiare_dto import AggiornaAnamnesiFamiliareDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class AnamnesiFamiliareService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_anamnesi(self):
        with self.dbobject.sessione("anamnesi") as db:
            anamnesi = db.query(AnamnesiFamiliare).all()
            return AggiornaAnamnesiFamiliareDTO(many=True).dump(anamnesi)
            
    def get_anamnesi_by_id(self, anamnesi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_familiare', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato")
                return None
            anamnesi = db.query(AnamnesiFamiliare).filter(AnamnesiFamiliare._id_paziente == anamnesi_id).first()
            if anamnesi:
                return AggiornaAnamnesiFamiliareDTO().dump(anamnesi)
            else:
                return None
            
    def nuova_anamnesi(self, anamnesi_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuova_anamnesi = AnamnesiFamiliare(**anamnesi_data)
            db.add(nuova_anamnesi)
            db.flush()
            return AggiornaAnamnesiFamiliareDTO().dump(nuova_anamnesi)
            
    def aggiorna_anamnesi(self, anamnesi_id, anamnesi_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_familiare', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato")
                return None
            anamnesi = db.query(AnamnesiFamiliare).filter(AnamnesiFamiliare._id_paziente == anamnesi_id).first()
            if anamnesi:
                for key, value in anamnesi_data.items():
                    setattr(anamnesi, key, value)
                db.flush()
                db.refresh(anamnesi)
                return AggiornaAnamnesiFamiliareDTO().dump(anamnesi)
            else:
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_anamnesi(self, anamnesi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_familiare', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'eliminazione")
                return False
            anamnesi = db.query(AnamnesiFamiliare).filter(AnamnesiFamiliare._id_paziente == anamnesi_id).first()
            if anamnesi:
                db.delete(anamnesi)
                return True
            else:
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'eliminazione")
                return False