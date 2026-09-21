from be.models.anamnesi_patologica_remota import AnamnesiPatologicaRemota
from be.dto.anamnesi_patologica_remota_dto import AnamnesiPatologicaRemotaResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class AnamnesiPatologicaRemotaService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_anamnesi(self):
        with self.dbobject.sessione("anamnesi") as db:
            anamnesi = db.query(AnamnesiPatologicaRemota).all()
            return AnamnesiPatologicaRemotaResponseDTO(many=True).dump(anamnesi)
            
    def get_anamnesi_by_id(self, anamnesi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_patologica_remota', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato")
                return None
            anamnesi = db.query(AnamnesiPatologicaRemota).filter(AnamnesiPatologicaRemota._id_paziente == anamnesi_id).first()
            if anamnesi:
                return AnamnesiPatologicaRemotaResponseDTO().dump(anamnesi)
            else:
                return None
            
    def nuova_anamnesi(self, anamnesi_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuova_anamnesi = AnamnesiPatologicaRemota(**anamnesi_data)
            db.add(nuova_anamnesi)
            db.flush()
            return AnamnesiPatologicaRemotaResponseDTO().dump(nuova_anamnesi)
            
    def aggiorna_anamnesi(self, anamnesi_id, anamnesi_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_patologica_remota', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato")
                return None
            anamnesi = db.query(AnamnesiPatologicaRemota).filter(AnamnesiPatologicaRemota._id_paziente == anamnesi_id).first()
            if anamnesi:
                for key, value in anamnesi_data.items():
                    setattr(anamnesi, key, value)
                db.flush()
                db.refresh(anamnesi)
                return AnamnesiPatologicaRemotaResponseDTO().dump(anamnesi)
            else:
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_anamnesi(self, anamnesi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'anamnesi_patologica_remota', 'id_paziente', anamnesi_id):
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'eliminazione")
                return False
            anamnesi = db.query(AnamnesiPatologicaRemota).filter(AnamnesiPatologicaRemota._id_paziente == anamnesi_id).first()
            if anamnesi:
                db.delete(anamnesi)
                return True
            else:
                ut.write_error_log(f"Anamnesi con ID {anamnesi_id} non trovato durante l'eliminazione")
                return False