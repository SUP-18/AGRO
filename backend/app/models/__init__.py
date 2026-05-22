from app.extensions import db
from app.models.user import User
from app.models.crop import Crop, CropData
from app.models.prediction import Prediction, Recommendation
from app.models.notification import Notification
from app.models.disease_report import DiseaseReport

__all__ = ['db', 'User', 'Crop', 'CropData', 'Prediction', 'Recommendation', 'Notification', 'DiseaseReport']
