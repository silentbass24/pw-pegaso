from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .base import Base

"""Modello per la tabella 'stato_genitori' che rappresenta lo stato dei genitori dei pazienti.
La tabella 'stato_genitori' ha una relazione uno-a-uno con la tabella 'anamnesi_familiare', rappresentata dalla chiave esterna 'id_anamnesi_familiare'."""

if TYPE_CHECKING:
    from .anamnesi_familiare import AnamnesiFamiliare

class StatoGenitori(Base):
    __tablename__ = 'stato_genitori'
    __table_args__ = {'schema': 'anamnesi'}

    _id: Mapped[uuid.UUID] = mapped_column( name="id", default=uuid.uuid4, primary_key=True, nullable=False)
    _id_anamnesi_familiare: Mapped[uuid.UUID] = mapped_column(ForeignKey('anamnesi.anamnesi_familiare.id_paziente'), name="id_anamnesi_familiare", nullable=False)
    _padre: Mapped[Optional[str]] = mapped_column(String(255), name='padre', nullable=True)
    _madre: Mapped[Optional[str]] = mapped_column(String(255), name='madre', nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False)


    anamnesi_familiare: Mapped["AnamnesiFamiliare"] = relationship("AnamnesiFamiliare", back_populates="stato_genitori")
    
    @property
    def padre(self) -> Optional[str]:
        return self._padre
    
    @padre.setter
    def padre(self, value: Optional[str]) -> None:
        self._padre = value
        
    @property
    def madre(self) -> Optional[str]:
        return self._madre
    
    @madre.setter
    def madre(self, value: Optional[str]) -> None:
        self._madre = value
        
    @property
    def id(self) -> uuid.UUID:
        return self._id

    @property
    def id_anamnesi_familiare(self) -> uuid.UUID:
        return self._id_anamnesi_familiare

    @property
    def created_at(self) -> datetime:
        return self._created_at

    @property
    def updated_at(self) -> datetime:
        return self._updated_at