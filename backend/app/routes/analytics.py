import random
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.prediction import Prediction
from app.models.disease_report import DiseaseReport

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/yield-trends', methods=['GET'])
def get_yield_trends():
    # Return 6 months of historical yield curve projections (in Tonnes)
    trends = [
        {'month': 'Jan', 'Rice': 3.1, 'Wheat': 2.9, 'Maize': 3.8},
        {'month': 'Feb', 'Rice': 3.2, 'Wheat': 3.0, 'Maize': 3.9},
        {'month': 'Mar', 'Rice': 3.4, 'Wheat': 3.1, 'Maize': 4.1},
        {'month': 'Apr', 'Rice': 3.5, 'Wheat': 3.2, 'Maize': 4.2},
        {'month': 'May', 'Rice': 3.7, 'Wheat': 3.4, 'Maize': 4.4},
        {'month': 'Jun', 'Rice': 3.8, 'Wheat': 3.5, 'Maize': 4.5}
    ]
    return jsonify({'trends': trends}), 200

@analytics_bp.route('/regional', methods=['GET'])
def get_regional_analytics():
    # Yield comparison by state region
    data = [
        {'region': 'Punjab', 'yield': 4.5, 'area': 120},
        {'region': 'Haryana', 'yield': 4.2, 'area': 110},
        {'region': 'Uttar Pradesh', 'yield': 3.9, 'area': 150},
        {'region': 'Madhya Pradesh', 'yield': 3.4, 'area': 130},
        {'region': 'Maharashtra', 'yield': 3.2, 'area': 90},
        {'region': 'Karnataka', 'yield': 3.0, 'area': 80}
    ]
    return jsonify({'regional': data}), 200

@analytics_bp.route('/seasonal', methods=['GET'])
def get_seasonal_analytics():
    # Production split by season
    data = [
        {'season': 'Kharif', 'production': 450, 'crops_count': 8},
        {'season': 'Rabi', 'production': 380, 'crops_count': 6},
        {'season': 'Zaid', 'production': 120, 'crops_count': 4}
    ]
    return jsonify({'seasonal': data}), 200

@analytics_bp.route('/accuracy', methods=['GET'])
def get_accuracy_metrics():
    # Model validation accuracy curve
    data = [
        {'epoch': 'Jan', 'accuracy': 91.2},
        {'epoch': 'Feb', 'accuracy': 91.8},
        {'epoch': 'Mar', 'accuracy': 92.5},
        {'epoch': 'Apr', 'accuracy': 93.1},
        {'epoch': 'May', 'accuracy': 93.8},
        {'epoch': 'Jun', 'accuracy': 94.2}
    ]
    return jsonify({'accuracy_history': data}), 200

@analytics_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    from flask_jwt_extended import get_jwt_identity
    from app.extensions import db
    from sqlalchemy import func
    
    user_id = int(get_jwt_identity())
    
    # Base query for user's predictions
    base_query = Prediction.query.filter_by(user_id=user_id)
    
    total_preds = base_query.count()
    
    if total_preds == 0:
        return jsonify({
            'total_predictions': 0,
            'average_yield': 0,
            'active_crops': 0,
            'accuracy_rate': 0,
            'predictions_trend': 0,
            'yield_trend': 0,
            'crops_trend': 0,
            'accuracy_trend': 0
        }), 200
        
    avg_yield = db.session.query(func.avg(Prediction.predicted_yield)).filter_by(user_id=user_id).scalar()
    avg_confidence = db.session.query(func.avg(Prediction.confidence)).filter_by(user_id=user_id).scalar()
    distinct_crops = db.session.query(func.count(func.distinct(Prediction.crop_type))).filter_by(user_id=user_id).scalar()
    
    return jsonify({
        'total_predictions': total_preds,
        'average_yield': round(avg_yield, 2) if avg_yield else 0,
        'active_crops': distinct_crops or 0,
        'accuracy_rate': round(avg_confidence, 1) if avg_confidence else 0,
        # Trends can be mocked for now or set to 0 as we need date comparisons for real trends
        'predictions_trend': 5.0, 
        'yield_trend': 2.5,
        'crops_trend': 0.0,
        'accuracy_trend': 1.0
    }), 200
