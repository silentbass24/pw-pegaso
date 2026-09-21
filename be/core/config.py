import os
from os.path import join
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
dotenv_path = join(ROOT_DIR, '.env')
load_dotenv(dotenv_path)

DB_HOST = os.environ.get('DB_HOST')
DB_PORT = int(os.environ.get('DB_PORT'))
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
SECRET_KEY = os.environ.get('SECRET_KEY')
POOL_SIZE = int(os.environ.get('POOL_SIZE'))
MAX_OVERFLOW = int(os.environ.get('MAX_OVERFLOW'))
POOL_TIMEOUT = int(os.environ.get('POOL_TIMEOUT'))
POOL_RECYCLE = int(os.environ.get('POOL_RECYCLE'))
POOL_PRE_PING = os.environ.get('POOL_PRE_PING')
SCHEMI_PERMESSI = os.environ.get('SCHEMI_PERMESSI')
IS_DEBUG = os.environ.get('IS_DEBUG')
HOST = os.environ.get('HOST')
SERVER_PORT = int(os.environ.get('SERVER_PORT')) 
SECRET_KEY = os.environ.get('SECRET_KEY')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES'))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get('REFRESH_TOKEN_EXPIRE_DAYS'))
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM')