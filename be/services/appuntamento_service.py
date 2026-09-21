from be.models.appuntamento_model import Appuntamento, AppuntamentoDettaglio
from be.dto.appuntamento_dto import AppuntamentoResponseDTO, AppuntamentoConDettagliResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class AppuntamentoService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_appuntamenti(self):
        with self.dbobject.sessione("public") as db:
            appuntamenti = db.query(Appuntamento).all()
            return AppuntamentoResponseDTO(many=True).dump(appuntamenti)
        
    def get_all_appuntamenti_con_dettagli(self):
            with self.dbobject.sessione("public") as db:
                appuntamenti = db.query(AppuntamentoDettaglio).all()
                return AppuntamentoConDettagliResponseDTO(many=True).dump(appuntamenti)
            
    def get_appuntamento_by_id(self, appuntamento_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'appuntamento', 'id', appuntamento_id):
                ut.write_error_log(f"Appuntamento con ID {appuntamento_id} non trovato")
                return None
            appuntamento = db.query(Appuntamento).filter(Appuntamento._id == appuntamento_id).first()
            if appuntamento:
                return AppuntamentoResponseDTO().dump(appuntamento)
            else:
                return None
            
    def nuovo_appuntamento(self, appuntamento_data):
        with self.dbobject.sessione("public") as db:
            nuovo_appuntamento = Appuntamento(**appuntamento_data)
            db.add(nuovo_appuntamento)
            db.flush()
            return AppuntamentoResponseDTO().dump(nuovo_appuntamento)
            
    def aggiorna_appuntamento(self, appuntamento_id, appuntamento_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'appuntamento', 'id', appuntamento_id):
                ut.write_error_log(f"Appuntamento con ID {appuntamento_id} non trovato")
                return None
            appuntamento = db.query(Appuntamento).filter(Appuntamento._id == appuntamento_id).first()
            if appuntamento:
                for key, value in appuntamento_data.items():
                    setattr(appuntamento, key, value)
                db.flush()
                db.refresh(appuntamento)
                return AppuntamentoResponseDTO().dump(appuntamento)
            else:
                ut.write_error_log(f"Appuntamento con ID {appuntamento_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_appuntamento(self, appuntamento_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'appuntamento', 'id', appuntamento_id):
                ut.write_error_log(f"Appuntamento con ID {appuntamento_id} non trovato durante l'eliminazione")
                return False
            appuntamento = db.query(Appuntamento).filter(Appuntamento._id == appuntamento_id).first()
            if appuntamento:
                db.delete(appuntamento)
                return True
            else:
                ut.write_error_log(f"Appuntamento con ID {appuntamento_id} non trovato durante l'eliminazione")
                return False