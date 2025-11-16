import os

class Config:
    FLASK_APP = 'devsmart.py'
    SECRET_KEY = os.getenv('SECRET_KEY', 'not-used-yet')
    DEBUG = False
    TESTING = False


def get_config():
    env = os.getenv('FLASK_ENV', 'colabothon25')
    return Config()