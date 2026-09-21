from be.models.contatti_model import Contatto
from be.dto.contatti_dto import ContattiResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut


class ContattiService:
    
    
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()
        

    def get_all_contatti(self):
        with self.dbobject.sessione("public") as db:
                contatti = db.query(Contatto).all()
                return ContattiResponseDTO(many=True).dump(contatti)
            
    def get_contatti_by_id(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'contatti', 'id_paziente', paziente_id):
                ut.write_error_log(f"Contatti con ID paziente {paziente_id} non trovato")
                return None
            contatti = db.query(Contatto).filter(Contatto._id_paziente == paziente_id).first()
            if contatti:
                return ContattiResponseDTO().dump(contatti)
            else:
                return None
            
    def nuovo_contatto(self, contatto_data):
        with self.dbobject.sessione("public") as db:
            nuovo_contatto = Contatto(**contatto_data)
            db.add(nuovo_contatto)
            db.flush()
            return ContattiResponseDTO().dump(nuovo_contatto)
            
    def aggiorna_contatti(self, paziente_id, contatti_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'contatti', 'id_paziente', paziente_id):
                ut.write_error_log(f"Contatto con ID paziente {paziente_id} non trovato")
                return None
            contatto = db.query(Contatto).filter(Contatto._id_paziente == paziente_id).first()
            if contatto:
                for key, value in contatti_data.items():
                    setattr(contatto, key, value)
                db.flush()
                db.refresh(contatto)
                return ContattiResponseDTO().dump(contatto)
            else:
                ut.write_error_log(f"Contatti con ID paziente {paziente_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_contatto(self, paziente_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'contatti', 'id_paziente', paziente_id):
                ut.write_error_log(f"Paziente con ID {paziente_id} non trovato durante l'eliminazione")
                return False
            contatti = db.query(Contatto).filter(Contatto._id_paziente == paziente_id).first()
            if contatti:
                db.delete(contatti)
                return True
            else:
                ut.write_error_log(f"Contatti con ID paziente {paziente_id} non trovato durante l'eliminazione")
                return False