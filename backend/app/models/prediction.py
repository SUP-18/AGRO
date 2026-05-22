from datetime import datetime
from app.extensions import db

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    crop_type = db.Column(db.String(50), nullable=False)
    soil_type = db.Column(db.String(50), nullable=False)
    rainfall = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    fertilizer_usage = db.Column(db.Float, nullable=False)
    land_area = db.Column(db.Float, nullable=False)
    predicted_yield = db.Column(db.Float, nullable=False)  # predicted metric (e.g. tons/ha)
    confidence = db.Column(db.Float, default=92.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'crop_type': self.crop_type,
            'soil_type': self.soil_type,
            'rainfall': self.rainfall,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'fertilizer_usage': self.fertilizer_usage,
            'land_area': self.land_area,
            'predicted_yield': self.predicted_yield,
            'confidence': self.confidence,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # irrigation, fertilizer, crop, water, soil
    content = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='Medium')  # Low, Medium, High, Critical
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'content': self.content,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
