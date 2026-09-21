
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
import sqlalchemy as sa
from .base import Base

class RefreshTokens(Base):
    __tablename__ = 'refresh_tokens'

    _id: Mapped[uuid.UUID] = mapped_column(primary_key=True, name="id", default=uuid.uuid4, nullable=False)
    _user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), name="user_id", nullable=False)
    _token: Mapped[str] = mapped_column(String(255), name="token", nullable=False)
    _expiry: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="expiry", nullable=False)
    _created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    
    
    @property
    def id(self) -> uuid.UUID:
        return self._id
    
    @property
    def user_id(self) -> uuid.UUID:
        return self._user_id
    
    @user_id.setter
    def user_id(self, value: uuid.UUID) -> None:
        self._user_id = value
        
    @property
    def token(self) -> str:
        return self._token
    
    @token.setter
    def token(self, value: str) -> None:
        self._token = value
        
    @property
    def expiry(self) -> datetime:
        return self._expiry
    
    @expiry.setter
    def expiry(self, value: datetime) -> None:
        self._expiry = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at