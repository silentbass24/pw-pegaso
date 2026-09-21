
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime, date
from sqlalchemy import Date, DateTime, ForeignKey
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String
from .base import Base

class Appuntamento(Base):
    __tablename__ = 'appuntamento'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _id_medico: Mapped[uuid.UUID] = mapped_column(ForeignKey("medico.id"), name="id_medico", nullable=False)
    _id_paziente: Mapped[uuid.UUID] = mapped_column(ForeignKey("paziente.id"), name="id_paziente", nullable=False)
    _id_slot: Mapped[uuid.UUID] = mapped_column(ForeignKey("slot.id"), name="id_slot", nullable=False)
    _data: Mapped[date] = mapped_column(Date, name="data", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, default=sa.func.now(), onupdate=sa.func.now())
    
    
    @property
    def id(self) -> uuid.UUID:
        return self._id
    
    @property
    def id_medico(self) -> uuid.UUID:
        return self._id_medico
    
    @id_medico.setter
    def id_medico(self, value: uuid.UUID):
        self._id_medico = value
    
    @property
    def id_paziente(self) -> uuid.UUID:
        return self._id_paziente
    
    @id_paziente.setter
    def id_paziente(self, value: uuid.UUID):
        self._id_paziente = value
    
    @property
    def id_slot(self) -> uuid.UUID:
        return self._id_slot
    
    @id_slot.setter
    def id_slot(self, value: uuid.UUID):
        self._id_slot = value

    @property
    def data(self) -> date:
        return self._data

    @data.setter
    def data(self, value: date):
        self._data = value

    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at
    
class AppuntamentoDettaglio(Base):
    __tablename__ = 'view_appuntamenti'
    _id_appuntamento: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, name="id_appuntamento")
    _id_paziente: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), name="id_paziente")
    _nome_paziente: Mapped[str] = mapped_column(String, name="nome_paziente")
    _cognome_paziente: Mapped[str] = mapped_column(String, name="cognome_paziente")
    _id_medico: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), name="id_medico")
    _nome_medico: Mapped[str] = mapped_column(String, name="nome_medico")
    _cognome_medico: Mapped[str] = mapped_column(String, name="cognome_medico")
    _id_slot: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), name="id_slot")
    _ora_inizio: Mapped[str] = mapped_column(String, name="ora_inizio")
    _ora_fine: Mapped[str] = mapped_column(String, name="ora_fine")
    _data: Mapped[date] = mapped_column(Date, name="data")

    @property
    def id_appuntamento(self): return self._id_appuntamento
    @property
    def id_paziente(self): return self._id_paziente
    @property
    def nome_paziente(self): return self._nome_paziente
    @property
    def cognome_paziente(self): return self._cognome_paziente
    @property
    def id_medico(self): return self._id_medico
    @property
    def nome_medico(self): return self._nome_medico
    @property
    def cognome_medico(self): return self._cognome_medico
    @property
    def id_slot(self): return self._id_slot
    @property
    def ora_inizio(self): return self._ora_inizio
    @property
    def ora_fine(self): return self._ora_fine
    @property
    def data(self): return self._data