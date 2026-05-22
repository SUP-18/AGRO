from datetime import datetime
from app.extensions import db

class DiseaseReport(db.Model):
    __tablename__ = 'disease_reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    disease_name = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, default=95.0)
    treatment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_path': self.image_path,
            'disease_name': self.disease_name,
            'confidence': self.confidence,
            'treatment': self.treatment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
