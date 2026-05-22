import os
import sys

# Add backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.crop import Crop, CropData
from app.models.notification import Notification

def seed_database():
    app = create_app()
    with app.app_context():
        print("Recreating database tables...")
        db.drop_all()
        db.create_all()
        
        print("Seeding users...")
        # 1. Admin
        admin = User(
            username='admin',
            email='admin@agropredict.com',
            role='admin',
            full_name='AgroPredict Admin',
            phone='+91 99999 00000',
            location='New Delhi, India'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # 2. Farmer
        farmer = User(
            username='devendra',
            email='farmer@agropredict.com',
            role='farmer',
            full_name='Devendra Singh',
            phone='+91 98765 43210',
            location='Ludhiana, Punjab'
        )
        farmer.set_password('farmer123')
        db.session.add(farmer)
        
        print("Seeding crops metadata...")
        crop_data = [
            {
                'name': 'Rice',
                'type': 'Cereal',
                'season': 'Kharif',
                'min_temp': 20.0,
                'max_temp': 35.0,
                'min_rainfall': 150.0,
                'max_rainfall': 300.0,
                'soil_type': 'Clay',
                'description': 'Rice is a water-intensive staple crop requiring high temperatures and clay/alluvial soil for maximum water retention.',
                'image_url': 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500'
            },
            {
                'name': 'Wheat',
                'type': 'Cereal',
                'season': 'Rabi',
                'min_temp': 10.0,
                'max_temp': 25.0,
                'min_rainfall': 50.0,
                'max_rainfall': 100.0,
                'soil_type': 'Loam',
                'description': 'Wheat is a temperate Rabi crop requiring cool weather during early growth and bright warm sunshine during ripening.',
                'image_url': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500'
            },
            {
                'name': 'Maize',
                'type': 'Cereal',
                'season': 'Kharif',
                'min_temp': 18.0,
                'max_temp': 32.0,
                'min_rainfall': 60.0,
                'max_rainfall': 150.0,
                'soil_type': 'Loam',
                'description': 'Maize (Corn) is a versatile cereal crop requiring well-aerated fertile soils and uniform sunshine.',
                'image_url': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500'
            },
            {
                'name': 'Cotton',
                'type': 'Fiber',
                'season': 'Kharif',
                'min_temp': 20.0,
                'max_temp': 35.0,
                'min_rainfall': 50.0,
                'max_rainfall': 100.0,
                'soil_type': 'Black',
                'description': 'Cotton is a major cash crop that thrives in deep, moisture-retentive black cotton soils with sunny climates.',
                'image_url': 'https://images.unsplash.com/photo-1594900571994-3a525f0e340b?w=500'
            },
            {
                'name': 'Sugarcane',
                'type': 'Commercial',
                'season': 'Kharif',
                'min_temp': 20.0,
                'max_temp': 35.0,
                'min_rainfall': 120.0,
                'max_rainfall': 250.0,
                'soil_type': 'Loam',
                'description': 'Sugarcane is a long-duration tropical grass that is extremely nitrogen-intensive and requires high annual rainfall.',
                'image_url': 'https://images.unsplash.com/photo-1594056268951-df4bfbc3f787?w=500'
            },
            {
                'name': 'Potato',
                'type': 'Tuber/Vegetable',
                'season': 'Rabi',
                'min_temp': 12.0,
                'max_temp': 22.0,
                'min_rainfall': 40.0,
                'max_rainfall': 80.0,
                'soil_type': 'Loam',
                'description': 'Potato is a cool-season tuber requiring well-drained, loose, sandy loam soils that prevent tuber rots.',
                'image_url': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500'
            },
            {
                'name': 'Tomato',
                'type': 'Vegetable',
                'season': 'Rabi',
                'min_temp': 15.0,
                'max_temp': 28.0,
                'min_rainfall': 40.0,
                'max_rainfall': 80.0,
                'soil_type': 'Loam',
                'description': 'Tomato is a high-yield vegetable requiring staking, balanced phosphorus/calcium nutrition, and uniform watering.',
                'image_url': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
            }
        ]
        
        for crop_fields in crop_data:
            c = Crop(**crop_fields)
            db.session.add(c)
            
        db.session.flush() # Fetch generated primary key IDs for crop data seeding
        
        print("Seeding crop historical regional stats...")
        # Get Crop objects
        rice = Crop.query.filter_by(name='Rice').first()
        wheat = Crop.query.filter_by(name='Wheat').first()
        
        if rice:
            r1 = CropData(crop_id=rice.id, region='Punjab', year=2024, production=45.2, area=10.0, yield_value=4.52)
            r2 = CropData(crop_id=rice.id, region='Haryana', year=2024, production=38.4, area=9.0, yield_value=4.27)
            db.session.add(r1)
            db.session.add(r2)
            
        if wheat:
            w1 = CropData(crop_id=wheat.id, region='Punjab', year=2024, production=38.0, area=10.0, yield_value=3.80)
            w2 = CropData(crop_id=wheat.id, region='Uttar Pradesh', year=2024, production=52.5, area=15.0, yield_value=3.50)
            db.session.add(w1)
            db.session.add(w2)
            
        print("Seeding default notifications...")
        # Seed default notifications for the farmer
        db.session.commit() # Flush first to generate farmer ID
        farmer_user = User.query.filter_by(username='devendra').first()
        
        if farmer_user:
            n1 = Notification(
                user_id=farmer_user.id,
                title='Heatwave Advisory',
                message='A major heatwave is forecast for the Ludhiana region. Increase irrigation frequency by 20% to prevent crop stress.',
                type='weather'
            )
            n2 = Notification(
                user_id=farmer_user.id,
                title='NPK Schedule Complete',
                message='Your Nitrogen fertilizer split dose schedule has been successfully generated. Click Prediction to view full report.',
                type='fertilizer'
            )
            db.session.add(n1)
            db.session.add(n2)
            
        db.session.commit()
        print("Database successfully seeded! Standard access credentials:")
        print(" => Admin User: admin@agropredict.com / admin123")
        print(" => Farmer User: farmer@agropredict.com / farmer123")

if __name__ == '__main__':
    seed_database()
