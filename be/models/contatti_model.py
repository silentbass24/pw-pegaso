from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .paziente_model import Paziente
from .base import Base

"""Modello per la tabella 'contatti' che rappresenta i contatti dei pazienti.
La tabella 'contatti' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""


class Contatto(Base):
    __tablename__ = 'contatti'

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'),  name="id_paziente", primary_key=True, nullable=False)
    _telefono: Mapped[Optional[str]] = mapped_column(String(30), name='telefono', nullable=True)
    _email: Mapped[str] = mapped_column(String(50), name='email', nullable=False)
    _mobile: Mapped[str] = mapped_column(String(30), name='mobile', nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())


    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="contatti", passive_deletes=True)
    
    @property
    def telefono(self) -> Optional[str]:
        return self._telefono
    
    @telefono.setter
    def telefono(self, value: Optional[str]) -> None:
        if value and len(value) > 30:
            raise ValueError("Il numero di telefono non può superare i 30 caratteri")
        self._telefono = value
        
    @property
    def email(self) -> str:
        return self._email
    
    @email.setter
    def email(self, value: str) -> None:
        self._email = value
    
    @property
    def mobile(self) -> str:
        return self._mobile
    
    @mobile.setter
    def mobile(self, value: str) -> None:
        self._mobile = value
    
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