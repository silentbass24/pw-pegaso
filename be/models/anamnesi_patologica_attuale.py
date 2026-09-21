from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Date, ForeignKey, DateTime
import sqlalchemy as sa
from .paziente_model import Paziente
from .base import Base


"""Modello per la tabella 'anamnesi_patologica_attuale' che rappresenta i dati di anamnesi patologica attuale dei pazienti.
La tabella 'anamnesi_patologica_attuale' ha una relazione uno-a-uno con la tabella 'pazienti', rappresentata dalla chiave esterna 'paziente_id'."""



class AnamnesiPatologicaAttuale(Base):
    __tablename__ = 'anamnesi_patologica_attuale'
    __table_args__ = {'schema': 'anamnesi'}

    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey('paziente.id', ondelete='CASCADE'), name="id_paziente", primary_key=True, nullable=False)
    _sintomatologia_principale: Mapped[Optional[str]] = mapped_column(String(255), name="sintomatologia_principale", nullable=True)
    _insorgenza: Mapped[Optional[date]] = mapped_column(Date, name="insorgenza", nullable=True)
    _durata: Mapped[Optional[str]] = mapped_column(String(255), name="durata", nullable=True)
    _fattori_miglioramento: Mapped[Optional[str]] = mapped_column(String(255), name="fattori_miglioramento", nullable=True)
    _fattori_peggioramento: Mapped[Optional[str]] = mapped_column(String(255), name="fattori_peggioramento", nullable=True)
    _sintomi_associati: Mapped[Optional[str]] = mapped_column(String(255), name="sintomi_associati", nullable=True)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    name="updated_at",
    nullable=False,
    default=sa.func.now(),
    onupdate=sa.func.now()
)
    

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="anamnesi_patologica_attuale", passive_deletes=True)
    
        
    @property
    def sintomatologia_principale(self) -> Optional[str]:
        return self._sintomatologia_principale

    @sintomatologia_principale.setter
    def sintomatologia_principale(self, value: Optional[str]):
        self._sintomatologia_principale = value
        
    @property
    def insorgenza(self) -> Optional[date]:
        return self._insorgenza
    
    @insorgenza.setter
    def insorgenza(self, value: Optional[date]):
        self._insorgenza = value
        
    @property
    def durata(self) -> Optional[str]:
        return self._durata
    
    @durata.setter
    def durata(self, value: Optional[str]):
        self._durata = value
    
    @property
    def fattori_miglioramento(self) -> Optional[str]:
        return self._fattori_miglioramento
    
    @fattori_miglioramento.setter
    def fattori_miglioramento(self, value: Optional[str]):
        self._fattori_miglioramento = value
    
    @property
    def fattori_peggioramento(self) -> Optional[str]:
        return self._fattori_peggioramento
    
    @fattori_peggioramento.setter
    def fattori_peggioramento(self, value: Optional[str]):
        self._fattori_peggioramento = value
        
    @property
    def sintomi_associati(self) -> Optional[str]:
        return self._sintomi_associati
    
    @sintomi_associati.setter
    def sintomi_associati(self, value: Optional[str]):
        self._sintomi_associati = value
        
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