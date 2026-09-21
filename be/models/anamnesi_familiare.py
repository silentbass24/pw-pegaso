from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .paziente_model import Paziente
from .base import Base

if TYPE_CHECKING:
    from .stato_fratelli import StatoFratelli
    from .stato_genitori import StatoGenitori


"""Modello per la tabella 'anamnesi_familiare' che rappresenta i dati di anamnesi familiare dei pazienti.
La tabella 'anamnesi_familiare' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""


class AnamnesiFamiliare(Base):
    __tablename__ = 'anamnesi_familiare'
    __table_args__ = {'schema': 'anamnesi'}

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _malattie_ereditarie: Mapped[Optional[str]] = mapped_column(String(255), name='malattie_ereditarie', nullable=True)
    _note_ambientali: Mapped[Optional[str]] = mapped_column(String(255), name='note_ambientali', nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())
    
    stato_fratelli: Mapped[list["StatoFratelli"]] = relationship("StatoFratelli", back_populates="anamnesi_familiare")
    stato_genitori: Mapped["StatoGenitori"] = relationship("StatoGenitori", back_populates="anamnesi_familiare")
    

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="anamnesi_familiare", passive_deletes=True)
    
    @property
    def malattie_ereditarie(self) -> Optional[str]:
        return self._malattie_ereditarie
    
    @malattie_ereditarie.setter
    def malattie_ereditarie(self, value: Optional[str]):
        self._malattie_ereditarie = value
        
    @property
    def note_ambientali(self) -> Optional[str]:
        return self._note_ambientali
    
    @note_ambientali.setter
    def note_ambientali(self, value: Optional[str]):
        self._note_ambientali = value
        
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
    def id_paziente(self, value: uuid.UUID):
        self._id_paziente = value