import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'agro_super_secret_key_849204921')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_agro_super_secret_key_583920193')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'sqlite:///' + os.path.join(BASE_DIR, 'agropredict.db')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload folder for disease crop detection scans
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
    
    # Custom configurations
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY', 'mock_weather_key')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
