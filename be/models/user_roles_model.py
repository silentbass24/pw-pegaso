from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from sqlalchemy import ForeignKey, Boolean, DateTime
import sqlalchemy as sa
from .base import Base

class UserRole(Base):
    __tablename__ = "user_roles"

    _user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), name="user_id", primary_key=True, nullable=False
    )
    _is_admin: Mapped[bool] = mapped_column(Boolean, name="is_admin", nullable=False, server_default=sa.text("false"))
    _is_doctor: Mapped[bool] = mapped_column(Boolean, name="is_doctor", nullable=False, server_default=sa.text("false"))
    _is_user: Mapped[bool] = mapped_column(Boolean, name="is_user", nullable=False, server_default=sa.text("true"))
    _created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), name="created_at", nullable=False, server_default=sa.func.now())
    _updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), name="updated_at", nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())

    user = relationship("Users", back_populates="user_role", uselist=False)

    @property
    def user_id(self) -> uuid.UUID:
        return self._user_id

    @property
    def is_admin(self) -> bool:
        return self._is_admin

    @property
    def is_doctor(self) -> bool:
        return self._is_doctor

    @property
    def is_user(self) -> bool:
        return self._is_user