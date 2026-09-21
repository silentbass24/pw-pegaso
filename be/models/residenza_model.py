from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .paziente_model import Paziente

"""Modello per la tabella 'residenze' che rappresenta le residenze dei pazienti.
La tabella 'residenze' ha una relazione molti-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""

class Residenza(Base):
    __tablename__ = 'residenza'

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _indirizzo: Mapped[str] = mapped_column(String(250), name="indirizzo", nullable=False)
    _citta: Mapped[str] = mapped_column(String(255), name="citta", nullable=False)
    _cap: Mapped[str] = mapped_column(String(5), name="cap", nullable=False)
    _numero_civico: Mapped[str] = mapped_column(String(30), name="numero_civico", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())

    paziente: Mapped["Paziente"] = relationship("be.models.paziente_model.Paziente", back_populates="residenza", passive_deletes=True)
    
    @property
    def indirizzo(self) -> str:
        return self._indirizzo
    
    @indirizzo.setter
    def indirizzo(self, value: str) -> None:
        self._indirizzo = value
        
    @property
    def citta(self) -> str:
        return self._citta
    
    @citta.setter
    def citta(self, value: str) -> None:
        self._citta = value
        
    @property
    def cap(self) -> str:
        return self._cap
    
    @cap.setter
    def cap(self, value: str) -> None:
        self._cap = value
        
    @property
    def numero_civico(self) -> str:
        return self._numero_civico
    
    @numero_civico.setter
    def numero_civico(self, value: str) -> None:
        self._numero_civico = value
        
    @property
    def id_paziente(self) -> uuid.UUID: 
        return self._id_paziente

    @property
    def created_at(self) -> datetime:
        return self._created_at

    @property
    def updated_at(self) -> datetime:
        return self._updated_at
    
    @id_paziente.setter
    def id_paziente(self, value: uuid.UUID) -> None:
        self._id_paziente = value