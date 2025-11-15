import os

class Config:
    FLASK_APP = 'app.py'
    SECRET_KEY = os.getenv('SECRET_KEY', 'not-used-yet')
    DEBUG = False
    TESTING = False
    DATABASE_URI = os.getenv('DATABASE_URI', 'not-used-yet')


def get_config():
    env = os.getenv('FLASK_EVN', 'colabothon25')
    return Config()