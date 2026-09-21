from be.models.user_roles_model import UserRole
from be.dto.users_role_dto import RuoliDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut
    
class UserRoleService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_user_role(self):
        with self.dbobject.sessione("auth") as db:
            users_role = db.query(UserRole).all()
            return RuoliDTO(many=True).dump(users_role)
            
    def get_user_role_by_id(self, user_role_id):
        with self.dbobject.sessione("auth") as db:
            if not self.dbobject.ControllaEsistenza(db, 'users_role', 'user_id', user_role_id):
                ut.write_error_log(f"Stato Genitori con ID {user_role_id} non trovato")
                return None
            stato_genitori = db.query(UserRole).filter(UserRole._id == user_role_id).first()
            if stato_genitori:
                return RuoliDTO().dump(user_role_id)
            else:
                return None
            
    def nuovo_user_role(self, user_role_data):
        with self.dbobject.sessione("auth") as db:
            nuovo_user_role = UserRole(**user_role_data)
            db.add(nuovo_user_role)
            db.flush()
            return RuoliDTO().dump(nuovo_user_role)
            
    def aggiorna_stato_genitori(self, user_role_id, user_role_data):
        with self.dbobject.sessione("auth") as db:
            if not self.dbobject.ControllaEsistenza(db, 'user_roles', 'user_id', user_role_id):
                ut.write_error_log(f"Stato Genitori con ID {user_role_id} non trovato")
                return None
            user_role = db.query(UserRole).filter(UserRole._id == user_role_id).first()
            if user_role:
                for key, value in user_role_data.items():
                    setattr(user_role, key, value)
                    setattr(user_role, key, value)
                    setattr(user_role, key, value)
                db.flush()
                db.refresh(user_role)
                return RuoliDTO().dump(user_role)
            else:
                ut.write_error_log(f"Stato Genitori con ID {user_role_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_user_role(self, user_role_id):
        with self.dbobject.sessione("auth") as db:
            if not self.dbobject.ControllaEsistenza(db, 'user_roles', 'user_id', user_role_id):
                ut.write_error_log(f"Stato Genitori con ID {user_role_id} non trovato durante l'eliminazione")
                return False
            stato_genitori = db.query(UserRole).filter(UserRole._id == user_role_id).first()
            if stato_genitori:
                db.delete(stato_genitori)
                return True
            else:
                ut.write_error_log(f"Stato Genitori con ID {user_role_id} non trovato durante l'eliminazione")
                return False