from be.models.slot_model import Slot
from be.dto.slot_dto import SlotResponseDTO
import sqlalchemy as sa
import be.core.database as database
import be.core.utilities as ut

class SlotService:
    def __init__(self, user_repository = None):
        self.user_repository = user_repository
        self.dbobject = database.Database()

    def get_all_slots(self):
        with self.dbobject.sessione("public") as db:
            slots = db.query(Slot).all()
            return SlotResponseDTO(many=True).dump(slots)
            
    def get_slot_by_id(self, slot_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'slot', 'id', slot_id):
                ut.write_error_log(f"Slot con ID {slot_id} non trovato")
                return None
            slot = db.query(Slot).filter(Slot._id == slot_id).first()
            if slot:
                return SlotResponseDTO().dump(slot)
            else:
                return None
            
    def nuovo_slot(self, slot_data):
        with self.dbobject.sessione("public") as db:
            nuovo_slot = Slot(**slot_data)
            db.add(nuovo_slot)
            db.flush()
            return SlotResponseDTO().dump(nuovo_slot)
            
    def aggiorna_slot(self, slot_id, slot_data):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'slot', 'id', slot_id):
                ut.write_error_log(f"Slot con ID {slot_id} non trovato")
                return None
            slot = db.query(Slot).filter(Slot._id == slot_id).first()
            if slot:
                for key, value in slot_data.items():
                    setattr(slot, key, value)
                db.flush()
                db.refresh(slot)
                return SlotResponseDTO().dump(slot)
            else:
                ut.write_error_log(f"Slot con ID {slot_id} non trovato durante l'aggiornamento")
                return None
            
    def elimina_slot(self, slot_id):
        with self.dbobject.sessione("public") as db:
            if not self.dbobject.ControllaEsistenza(db, 'slot', 'id', slot_id):
                ut.write_error_log(f"Slot con ID {slot_id} non trovato durante l'eliminazione")
                return False
            slot = db.query(Slot).filter(Slot._id == slot_id).first()
            if slot:
                db.delete(slot)
                return True
            else:
                ut.write_error_log(f"Slot con ID {slot_id} non trovato durante l'eliminazione")
                return False