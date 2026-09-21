from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa 
if TYPE_CHECKING:
    from .paziente_model import Paziente
from .base import Base


"""Modello per la tabella 'farmaci_allergie' che rappresenta i dati di farmaci e allergie dei pazienti.
La tabella 'farmaci_allergie' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""



class FarmaciAllergie(Base):
    __tablename__ = 'farmaci_allergie'
    __table_args__ = {'schema': 'anamnesi'}

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _terapie_in_corso: Mapped[Optional[str]] = mapped_column(String(255), name="terapie_in_corso", nullable=True)
    _farmaci_passati: Mapped[Optional[str]] = mapped_column(String(255), name="farmaci_passati", nullable=True)
    _allergie: Mapped[Optional[str]] = mapped_column(String(255), name="allergie", nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())
    

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="farmaci_allergie", passive_deletes=True)
    
        
    @property
    def terapie_in_corso(self) -> Optional[str]:
        return self._terapie_in_corso
    
    @terapie_in_corso.setter
    def terapie_in_corso(self, value: Optional[str]):
        self._terapie_in_corso = value
        
    @property
    def farmaci_passati(self) -> Optional[str]:
        return self._farmaci_passati
    
    @farmaci_passati.setter
    def farmaci_passati(self, value: Optional[str]):
        self._farmaci_passati = value
        
    @property
    def allergie(self) -> Optional[str]:
        return self._allergie
    
    @allergie.setter
    def allergie(self, value: Optional[str]):
        self._allergie = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at
    
    @property
    def id_paziente(self) -> uuid.UUID:
        return self._id_paziente
    
    @id_paziente.setter
    def id_paziente(self, value: uuid.UUID):
        self._id_paziente = value