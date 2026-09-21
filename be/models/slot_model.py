
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime
import sqlalchemy as sa
from .base import Base

class Slot(Base):
    __tablename__ = 'slot'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _ora_inizio: Mapped[str] = mapped_column(String(100), name="ora_inizio", nullable=False)
    _ora_fine: Mapped[str] = mapped_column(String(100), name="ora_fine", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    
    
    @property
    def id(self) -> uuid.UUID:
        return self._id
    
    @property
    def ora_inizio(self) -> str:
        return self._ora_inizio
    
    @ora_inizio.setter
    def ora_inizio(self, value: str) -> None:
        self._ora_inizio = value
        
    @property
    def ora_fine(self) -> str:
        return self._ora_fine
    
    @ora_fine.setter
    def ora_fine(self, value: str) -> None:
        self._ora_fine = value

    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at