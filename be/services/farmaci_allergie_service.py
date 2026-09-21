from be.models.farmaci_allergie import FarmaciAllergie
from be.dto.farmaci_allergie_dto import FarmaciAllergieResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut
    
class FarmaciAllergieService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_farmaci_allergie(self):
        with self.dbobject.sessione("anamnesi") as db:
            farmaci_allergie = db.query(FarmaciAllergie).all()
            return FarmaciAllergieResponseDTO(many=True).dump(farmaci_allergie)
            
    def get_farmaci_allergie_by_id(self, farmaci_allergie_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'farmaci_allergie', 'id_paziente', farmaci_allergie_id):
                ut.write_error_log(f"Farmaci/Allergie con ID {farmaci_allergie_id} non trovato")
                return None
            farmaci_allergie = db.query(FarmaciAllergie).filter(FarmaciAllergie._id_paziente == farmaci_allergie_id).first()
            if farmaci_allergie:
                return FarmaciAllergieResponseDTO().dump(farmaci_allergie)
            else:
                return None
            
    def nuova_farmaci_allergie(self, farmaci_allergie_data):
        with self.dbobject.sessione("anamnesi") as db:
            nuova_farmaci_allergie = FarmaciAllergie(**farmaci_allergie_data)
            db.add(nuova_farmaci_allergie)
            db.flush()
            return FarmaciAllergieResponseDTO().dump(nuova_farmaci_allergie)
            
    def aggiorna_farmaci_allergie(self, farmaci_allergie_id, farmaci_allergie_data):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'farmaci_allergie', 'id_paziente', farmaci_allergie_id):
                ut.write_error_log(f"Farmaci/Allergie con ID {farmaci_allergie_id} non trovato")
                return None
            farmaci_allergie = db.query(FarmaciAllergie).filter(FarmaciAllergie._id_paziente == farmaci_allergie_id).first()
            if farmaci_allergie:
                for key, value in farmaci_allergie_data.items():
                    setattr(farmaci_allergie, key, value)
                db.flush()
                db.refresh(farmaci_allergie)
                return FarmaciAllergieResponseDTO().dump(farmaci_allergie)
            else:
                ut.write_error_log(f"Farmaci/Allergie con ID {farmaci_allergie_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_farmaci_allergie(self, farmaci_allergie_id):
        with self.dbobject.sessione("anamnesi") as db:
            if not self.dbobject.ControllaEsistenza(db, 'farmaci_allergie', 'id_paziente', farmaci_allergie_id):
                ut.write_error_log(f"Farmaci/Allergie con ID {farmaci_allergie_id} non trovato durante l'eliminazione")
                return False
            farmaci_allergie = db.query(FarmaciAllergie).filter(FarmaciAllergie._id_paziente == farmaci_allergie_id).first()
            if farmaci_allergie:
                db.delete(farmaci_allergie)
                return True
            else:
                ut.write_error_log(f"Farmaci/Allergie con ID {farmaci_allergie_id} non trovato durante l'eliminazione")
                return False