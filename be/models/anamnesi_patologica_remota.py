from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
import sqlalchemy as sa
from .paziente_model import Paziente
from .base import Base


"""Modello per la tabella 'anamnesi_patologica_remota' che rappresenta i dati di anamnesi patologica remota dei pazienti.
La tabella 'anamnesi_patologica_remota' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""



class AnamnesiPatologicaRemota(Base):
    __tablename__ = 'anamnesi_patologica_remota'
    __table_args__ = {'schema': 'anamnesi'}

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _malattie_pregresse: Mapped[Optional[str]] = mapped_column(String(255), name="malattie_pregresse", nullable=True)
    _interventi_chirurgici: Mapped[Optional[str]] = mapped_column(String(255), name="interventi_chirurgici", nullable=True)
    _ricoveri: Mapped[Optional[str]] = mapped_column(String(255), name="ricoveri", nullable=True)
    _traumi: Mapped[Optional[str]] = mapped_column(String(255), name="traumi", nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())
    

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="anamnesi_patologica_remota",passive_deletes=True)
    
        
    @property
    def malattie_pregresse(self) -> Optional[str]:
        return self._malattie_pregresse
    
    @malattie_pregresse.setter
    def malattie_pregresse(self, value: Optional[str]):
        self._malattie_pregresse = value
        
    @property
    def interventi_chirurgici(self) -> Optional[str]:
        return self._interventi_chirurgici
    
    @interventi_chirurgici.setter
    def interventi_chirurgici(self, value: Optional[str]):
        self._interventi_chirurgici = value
        
    @property
    def ricoveri(self) -> Optional[str]:
        return self._ricoveri
    
    @ricoveri.setter
    def ricoveri(self, value: Optional[str]):
        self._ricoveri = value
    
    @property
    def traumi(self) -> Optional[str]:
        return self._traumi
    
    @traumi.setter
    def traumi(self, value: Optional[str]):
        self._traumi = value
    
        
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