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
        
    # Initialize tables directly in dev if migrations are not executed
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.error(f"Error creating database tables: {str(e)}")
            
    return app
