from app.routes.auth import auth_bp
from app.routes.prediction import prediction_bp
from app.routes.disease import disease_bp
from app.routes.weather import weather_bp
from app.routes.admin import admin_bp
from app.routes.recommendations import recommendations_bp
from app.routes.analytics import analytics_bp
from app.routes.notifications import notifications_bp
from app.routes.chatbot import chatbot_bp

__all__ = [
    'auth_bp',
    'prediction_bp',
    'disease_bp',
    'weather_bp',
    'admin_bp',
    'recommendations_bp',
    'analytics_bp',
    'notifications_bp',
    'chatbot_bp'
]
