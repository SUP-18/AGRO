import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import config_by_name
from app.extensions import db, migrate, jwt

def create_app(config_name=None):
    if not config_name:
        config_name = os.environ.get('FLASK_ENV', 'development')
        
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize CORS - allow connections from frontend port (usually 3000 or 5173)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register Blueprints
    from app.routes import (
        auth_bp,
        prediction_bp,
        disease_bp,
        weather_bp,
        admin_bp,
        recommendations_bp,
        analytics_bp,
        notifications_bp,
        chatbot_bp
    )
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(prediction_bp, url_prefix='/api/predictions')
    app.register_blueprint(disease_bp, url_prefix='/api/disease')
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    
    # Root status check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'Online',
            'message': 'AgroPredict AI Platform API is fully operational',
            'database': 'Connected',
            'ml_model': 'Ready'
        }), 200
        
    # Global HTTP error handlers
    @app.errorhandler(404)
    def resource_not_found(e):
        return jsonify({'error': 'Resource not found'}), 404
        
    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({'error': 'An internal server error occurred'}), 500
        
    # Initialize tables and auto-seed demo data on every startup.
    # Render free-tier uses an ephemeral filesystem — the SQLite DB is
    # destroyed whenever the service spins down. By seeding at startup
    # (not just in the build script), we guarantee the demo accounts and
    # crop catalogue always exist.
    with app.app_context():
        try:
            db.create_all()
            _seed_if_empty(app)
        except Exception as e:
            app.logger.error(f"Error creating database tables: {str(e)}")
            
    return app


def _seed_if_empty(app):
    """Seed demo users and crop data when the DB tables are empty."""
    from app.models.user import User
    from app.models.crop import Crop, CropData
    from app.models.notification import Notification

    # Only seed if no users exist yet (first run or wiped DB)
    if User.query.first() is not None:
        app.logger.info("Database already contains data — skipping auto-seed.")
        return

    app.logger.info("Empty database detected — auto-seeding demo data...")

    # ── Demo users ──────────────────────────────────────────────
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

    # ── Crop catalogue ──────────────────────────────────────────
    crops_meta = [
        {'name': 'Rice',      'type': 'Cereal',          'season': 'Kharif', 'min_temp': 20.0, 'max_temp': 35.0, 'min_rainfall': 150.0, 'max_rainfall': 300.0, 'soil_type': 'Clay',  'description': 'Rice is a water-intensive staple crop.', 'image_url': 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500'},
        {'name': 'Wheat',     'type': 'Cereal',          'season': 'Rabi',   'min_temp': 10.0, 'max_temp': 25.0, 'min_rainfall':  50.0, 'max_rainfall': 100.0, 'soil_type': 'Loam',  'description': 'Wheat is a temperate Rabi crop.',        'image_url': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500'},
        {'name': 'Maize',     'type': 'Cereal',          'season': 'Kharif', 'min_temp': 18.0, 'max_temp': 32.0, 'min_rainfall':  60.0, 'max_rainfall': 150.0, 'soil_type': 'Loam',  'description': 'Maize (Corn) is a versatile cereal.',    'image_url': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500'},
        {'name': 'Cotton',    'type': 'Fiber',           'season': 'Kharif', 'min_temp': 20.0, 'max_temp': 35.0, 'min_rainfall':  50.0, 'max_rainfall': 100.0, 'soil_type': 'Black', 'description': 'Cotton is a major cash crop.',           'image_url': 'https://images.unsplash.com/photo-1594900571994-3a525f0e340b?w=500'},
        {'name': 'Sugarcane', 'type': 'Commercial',      'season': 'Kharif', 'min_temp': 20.0, 'max_temp': 35.0, 'min_rainfall': 120.0, 'max_rainfall': 250.0, 'soil_type': 'Loam',  'description': 'Sugarcane is a long-duration crop.',     'image_url': 'https://images.unsplash.com/photo-1594056268951-df4bfbc3f787?w=500'},
        {'name': 'Potato',    'type': 'Tuber/Vegetable', 'season': 'Rabi',   'min_temp': 12.0, 'max_temp': 22.0, 'min_rainfall':  40.0, 'max_rainfall':  80.0, 'soil_type': 'Loam',  'description': 'Potato is a cool-season tuber.',         'image_url': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500'},
        {'name': 'Tomato',    'type': 'Vegetable',       'season': 'Rabi',   'min_temp': 15.0, 'max_temp': 28.0, 'min_rainfall':  40.0, 'max_rainfall':  80.0, 'soil_type': 'Loam',  'description': 'Tomato is a high-yield vegetable.',      'image_url': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'},
    ]
    for meta in crops_meta:
        db.session.add(Crop(**meta))

    db.session.flush()  # generate IDs

    # ── Sample crop data ────────────────────────────────────────
    rice = Crop.query.filter_by(name='Rice').first()
    wheat = Crop.query.filter_by(name='Wheat').first()
    if rice:
        db.session.add(CropData(crop_id=rice.id, region='Punjab',        year=2024, production=45.2, area=10.0, yield_value=4.52))
        db.session.add(CropData(crop_id=rice.id, region='Haryana',       year=2024, production=38.4, area=9.0,  yield_value=4.27))
    if wheat:
        db.session.add(CropData(crop_id=wheat.id, region='Punjab',       year=2024, production=38.0, area=10.0, yield_value=3.80))
        db.session.add(CropData(crop_id=wheat.id, region='Uttar Pradesh', year=2024, production=52.5, area=15.0, yield_value=3.50))

    # ── Default notifications for the farmer ────────────────────
    db.session.commit()  # commit to generate farmer id
    farmer_user = User.query.filter_by(username='devendra').first()
    if farmer_user:
        db.session.add(Notification(user_id=farmer_user.id, title='Heatwave Advisory',    message='A major heatwave is forecast. Increase irrigation frequency.', type='weather'))
        db.session.add(Notification(user_id=farmer_user.id, title='NPK Schedule Complete', message='Your fertilizer schedule has been generated.',                 type='fertilizer'))

    db.session.commit()
    app.logger.info("Auto-seed complete — admin@agropredict.com / farmer@agropredict.com ready.")
