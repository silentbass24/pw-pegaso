from be.models.analisi_psico_sociale import AnalisiPsicoSociale
from be.dto.analisi_psico_sociale_dto import AnalisiPsicoSocialeResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class AnalisiPsicoSocialeService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_analisi(self):
        with self.dbobject.sessione("anamnesi") as db:
            analisi = db.query(AnalisiPsicoSociale).all()
            return AnalisiPsicoSocialeResponseDTO(many=True).dump(analisi)
            
    def get_analisi_by_id(self, analisi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'analisi_psico_sociale', 'id_paziente', analisi_id):
                ut.write_error_log(f"Analisi con ID {analisi_id} non trovato")
                return None
            analisi = db.query(AnalisiPsicoSociale).filter(AnalisiPsicoSociale._id_paziente == analisi_id).first()
            if analisi:
                return AnalisiPsicoSocialeResponseDTO().dump(analisi)
            else:
                return None
            
    def nuovo_analisi(self, analisi_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuova_analisi = AnalisiPsicoSociale(**analisi_data)
            db.add(nuova_analisi)
            db.flush()
            return AnalisiPsicoSocialeResponseDTO().dump(nuova_analisi)
            
    def aggiorna_analisi(self, analisi_id, analisi_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'analisi_psico_sociale', 'id_paziente', analisi_id):
                ut.write_error_log(f"Analisi con ID {analisi_id} non trovato")
                return None
            analisi = db.query(AnalisiPsicoSociale).filter(AnalisiPsicoSociale._id_paziente == analisi_id).first()
            if analisi:
                for key, value in analisi_data.items():
                    setattr(analisi, key, value)
                db.flush()
                db.refresh(analisi)
                return AnalisiPsicoSocialeResponseDTO().dump(analisi)
            else:
                ut.write_error_log(f"Analisi con ID {analisi_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_analisi(self, analisi_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'analisi_psico_sociale', 'id_paziente', analisi_id):
                ut.write_error_log(f"Analisi con ID {analisi_id} non trovato durante l'eliminazione")
                return False
            analisi = db.query(AnalisiPsicoSociale).filter(AnalisiPsicoSociale._id_paziente == analisi_id).first()
            if analisi:
                db.delete(analisi)
                return True
            else:
                ut.write_error_log(f"Analisi con ID {analisi_id} non trovato durante l'eliminazione")
                return False