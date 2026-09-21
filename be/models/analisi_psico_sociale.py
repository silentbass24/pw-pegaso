from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .paziente_model import Paziente
from .base import Base


"""Modello per la tabella 'analisi_psico_sociale' che rappresenta i dati di analisi psico-sociale dei pazienti.
La tabella 'analisi_psico_sociale' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""



class AnalisiPsicoSociale(Base):
    __tablename__ = 'analisi_psico_sociale'
    __table_args__ = {'schema': 'anamnesi'}

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _lavoro: Mapped[Optional[str]] = mapped_column(String(255), name="lavoro", nullable=True)
    _stress: Mapped[Optional[str]] = mapped_column(String(255), name="stress", nullable=True)
    _supporto_familiare: Mapped[Optional[str]] = mapped_column(String(255), name="supporto_familiare", nullable=True)
    _condizioni_abitative: Mapped[Optional[str]] = mapped_column(String(255), name="condizioni_abitative", nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())
    

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="analisi_psico_sociale", passive_deletes=True)
    
        
    @property
    def lavoro(self) -> Optional[str]:
        return self._lavoro
    
    @lavoro.setter
    def lavoro(self, value: Optional[str]):
        self._lavoro = value
        
    @property
    def stress(self) -> Optional[str]:
        return self._stress
    
    @stress.setter
    def stress(self, value: Optional[str]):
        self._stress = value
        
    @property
    def supporto_familiare(self) -> Optional[str]:
        return self._supporto_familiare
    
    @supporto_familiare.setter
    def supporto_familiare(self, value: Optional[str]):
        self._supporto_familiare = value
    
    @property
    def condizioni_abitative(self) -> Optional[str]:
        return self._condizioni_abitative
    
    @condizioni_abitative.setter
    def condizioni_abitative(self, value: Optional[str]):
        self._condizioni_abitative = value
    
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