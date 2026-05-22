from app.extensions import db

class Crop(db.Model):
    __tablename__ = 'crops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    type = db.Column(db.String(50), nullable=True)  # Cereal, Vegetable, Fiber, etc.
    season = db.Column(db.String(20), nullable=True)  # Kharif, Rabi, Zaid
    min_temp = db.Column(db.Float, nullable=True)
    max_temp = db.Column(db.Float, nullable=True)
    min_rainfall = db.Column(db.Float, nullable=True)
    max_rainfall = db.Column(db.Float, nullable=True)
    soil_type = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    # Relationships
    historical_data = db.relationship('CropData', backref='crop', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'season': self.season,
            'min_temp': self.min_temp,
            'max_temp': self.max_temp,
            'min_rainfall': self.min_rainfall,
            'max_rainfall': self.max_rainfall,
            'soil_type': self.soil_type,
            'description': self.description,
            'image_url': self.image_url
        }

class CropData(db.Model):
    __tablename__ = 'crop_historical_data'

    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id', ondelete='CASCADE'), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    production = db.Column(db.Float, nullable=True)  # Tonnes
    area = db.Column(db.Float, nullable=True)  # Hectares
    yield_value = db.Column(db.Float, nullable=True)  # Tonnes per hectare

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'region': self.region,
            'year': self.year,
            'production': self.production,
            'area': self.area,
            'yield_value': self.yield_value
        }
