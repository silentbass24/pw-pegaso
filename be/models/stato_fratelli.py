from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from datetime import datetime
import uuid
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .base import Base

"""Modello per la tabella 'stato_fratelli' che rappresenta lo stato dei fratelli dei pazienti.
La tabella 'stato_fratelli' ha una relazione uno-a-molti con la tabella 'anamnesi_familiare', rappresentata dalla chiave esterna 'id_anamnesi_familiare'."""

if TYPE_CHECKING:
    from .anamnesi_familiare import AnamnesiFamiliare

class StatoFratelli(Base):
    __tablename__ = 'stato_fratelli'
    __table_args__ = {'schema': 'anamnesi'}

    id: Mapped[uuid.UUID] = mapped_column( name="id", default=uuid.uuid4, primary_key=True, nullable=False)
    _id_anamnesi_familiare: Mapped[uuid.UUID] = mapped_column(ForeignKey('anamnesi.anamnesi_familiare.id_paziente'), name="id_anamnesi_familiare", nullable=False)
    _nome: Mapped[str] = mapped_column(String(255), name='nome', nullable=False)
    _stato: Mapped[str] = mapped_column(String(255), name='stato', nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    

    anamnesi_familiare: Mapped["AnamnesiFamiliare"] = relationship("AnamnesiFamiliare", back_populates="stato_fratelli")
    
    @property
    def nome(self) -> str:
        return self._nome
    
    @nome.setter
    def nome(self, value: str) -> None:
        self._nome = value
        
    @property
    def stato(self) -> str:
        return self._stato
    
    @stato.setter
    def stato(self, value: str) -> None:
        self._stato = value
        
    @property
    def id_anamnesi_familiare(self) -> uuid.UUID:
        return self._id_anamnesi_familiare
    
    @property
    def created_at(self) -> datetime:
        return self._created_at

    @property
    def updated_at(self) -> datetime:
        return self._updated_at