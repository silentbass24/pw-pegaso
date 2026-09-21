
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime
import sqlalchemy as sa
from .base import Base

class Medico(Base):
    __tablename__ = 'medico'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _nome: Mapped[str] = mapped_column(String(100), name="nome", nullable=False)
    _cognome: Mapped[str] = mapped_column(String(100), name="cognome", nullable=False)
    _specializzazione: Mapped[str] = mapped_column(String(100), name="specializzazione", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    
    
    @property
    def id(self) -> uuid.UUID:
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
    def specializzazione(self) -> str:
        return self._specializzazione
    
    @specializzazione.setter
    def specializzazione(self, value: str) -> None:
        self._specializzazione = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at