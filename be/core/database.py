from contextlib import contextmanager
from typing import Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
import be.core.config as config

"""Class Database per la gestione della connessione al database
I parametri di connessione al database sono letti dal file .env
Il metodo ConnectToDB accetta un parametro opzionale 'schema' che permette di specificare lo schema a cui connettersi.
Se lo schema specificato non è presente nella lista degli schemi permessi, viene sollevata un'eccezione ValueError."""
class Database:
    _engine = None

    def __init__(self):
        self._db_name = config.DB_NAME
        if Database._engine is None:
            url = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{self._db_name}"
            Database._engine = create_engine(
                url,
                pool_size=config.POOL_SIZE,
                max_overflow=config.MAX_OVERFLOW,
                pool_timeout=config.POOL_TIMEOUT,
                pool_recycle=config.POOL_RECYCLE,
                pool_pre_ping=config.POOL_PRE_PING,
            )
        self._SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Database._engine)
        
    def ConnectToDB(self, schema: Optional[str] = None) -> Session:
        session = self._SessionLocal()
        if schema:
            allowed = getattr(config, "SCHEMI_PERMESSI", {"public", "auth", "anamnesi"})
            if schema not in allowed:
                raise ValueError(f"Schema '{schema}' non permesso")
            session.execute(text("SET search_path TO :schema").bindparams(schema=schema))
        return session

    def CloseDB(self, session: Session) -> None:
        session.close()
        
    @contextmanager
    def sessione(self, schema: Optional[str] = "public"):
        db = self.ConnectToDB(schema)
        try:
            yield db
            db.commit()
        except:
            db.rollback()
            raise
        finally:
            self.CloseDB(db)

    def ControllaEsistenza(self, session: Session, table: str, column: str, value: any) -> bool:
        result = session.execute(text(f"SELECT 1 FROM {table} WHERE {column} = :value").bindparams(value=value)).fetchone()
        return result is not None