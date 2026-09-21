from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean
import sqlalchemy as sa
from .base import Base
if TYPE_CHECKING:
    from .roles_model import Roles
    from .user_roles_model import UserRole

class Users(Base):
    __tablename__ = 'users'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _username: Mapped[str] = mapped_column(String(255), name="username", nullable=False)
    _password: Mapped[str] = mapped_column(String(255), name="password", nullable=False)
    _enabled: Mapped[bool] = mapped_column(Boolean, name="enabled", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    user_role = relationship("UserRole", back_populates="user", uselist=False)
    
    
    @property
    def id(self) -> uuid.UUID:
        return self._id
    
    @property
    def username(self) -> str:
        return self._username
    
    @username.setter
    def username(self, value: str) -> None:
        self._username = value
        
    @property
    def password(self) -> str:
        return self._password
    
    @password.setter
    def password(self, value: str) -> None:
        self._password = value
        
    @property
    def enabled(self) -> bool:
        return self._enabled
    
    @enabled.setter
    def enabled(self, value: bool) -> None:
        self._enabled = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at