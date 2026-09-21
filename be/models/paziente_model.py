from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime, date
from sqlalchemy import String, Date, DateTime
import sqlalchemy as sa
if TYPE_CHECKING:
    from .residenza_model import Residenza
    from .contatti_model import Contatto
    from .analisi_psico_sociale import AnalisiPsicoSociale
    from .farmaci_allergie import FarmaciAllergie
    from .anamnesi_familiare import AnamnesiFamiliare
    from .anamnesi_patologica_attuale import AnamnesiPatologicaAttuale
    from .anamnesi_patologica_remota import AnamnesiPatologicaRemota
from .base import Base

class Paziente(Base):
    __tablename__ = 'paziente'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _nome: Mapped[str] = mapped_column(String(100), name="nome", nullable=False)
    _cognome: Mapped[str] = mapped_column(String(100), name="cognome", nullable=False)
    _data_nascita: Mapped[date] = mapped_column(Date, name="data_nascita", nullable=False)
    _codice_fiscale: Mapped[str] = mapped_column(String(16), name="codice_fiscale", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    
    residenza: Mapped["Residenza"] = relationship("be.models.residenza_model.Residenza", back_populates="paziente", uselist=False, passive_deletes=True)
    contatti: Mapped["Contatto"] = relationship("be.models.contatti_model.Contatto", back_populates="paziente", uselist=False, passive_deletes=True)
    analisi_psico_sociale: Mapped["AnalisiPsicoSociale"] = relationship("be.models.analisi_psico_sociale.AnalisiPsicoSociale", back_populates="paziente", uselist=False, passive_deletes=True)
    farmaci_allergie: Mapped["FarmaciAllergie"] = relationship("be.models.farmaci_allergie.FarmaciAllergie", back_populates="paziente", uselist=False, passive_deletes=True)
    anamnesi_familiare: Mapped["AnamnesiFamiliare"] = relationship("be.models.anamnesi_familiare.AnamnesiFamiliare", back_populates="paziente", uselist=False, passive_deletes=True)

    anamnesi_patologica_attuale: Mapped["AnamnesiPatologicaAttuale"] = relationship(
        "be.models.anamnesi_patologica_attuale.AnamnesiPatologicaAttuale",
        back_populates="paziente",
        uselist=False,
        passive_deletes=True
    )

    anamnesi_patologica_remota: Mapped["AnamnesiPatologicaRemota"] = relationship(
        "be.models.anamnesi_patologica_remota.AnamnesiPatologicaRemota",
        back_populates="paziente",
        uselist=False,
        passive_deletes=True
    )
    
    @property
    def id(self) -> str:
        return self._id
    
    @property
    def nome(self) -> str:
        return self._nome
    
    @nome.setter
    def nome(self, value: str) -> None:
        self._nome = value
        
    @property
    def cognome(self) -> str:
        return self._cognome
    
    @cognome.setter
    def cognome(self, value: str) -> None:
        self._cognome = value
        
    @property
    def data_nascita(self) -> date:
        return self._data_nascita
    
    @data_nascita.setter
    def data_nascita(self, value: date) -> None:
        self._data_nascita = value
    
    @property
    def codice_fiscale(self) -> str:
        return self._codice_fiscale
    
    @codice_fiscale.setter
    def codice_fiscale(self, value: str) -> None:
        self._codice_fiscale = value 
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at