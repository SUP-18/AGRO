from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ml.recommendation_engine import RecommendationEngine
from app.models.prediction import Recommendation

recommendations_bp = Blueprint('recommendations', __name__)
advisor = RecommendationEngine()

@recommendations_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_recommendations():
    user_id = int(get_jwt_identity())
    recs = Recommendation.query.filter_by(user_id=user_id).order_by(Recommendation.created_at.desc()).all()
    return jsonify({'recommendations': [r.to_dict() for r in recs]}), 200

@recommendations_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_recommendations():
    data = request.get_json() or {}
    crop_type = data.get('crop_type', 'Rice')
    soil_type = data.get('soil_type', 'Loam')
    temperature = data.get('temperature', 25.0)
    rainfall = data.get('rainfall', 100.0)
    humidity = data.get('humidity', 60.0)
    
    npk = advisor.get_fertilizer_plan(crop_type, soil_type)
    irrigation = advisor.get_irrigation_schedule(crop_type, soil_type, temperature, rainfall)
    soil_tips = advisor.get_soil_tips(soil_type)
    crop_suggestions = advisor.suggest_crops(soil_type, rainfall, temperature, humidity)
    
    return jsonify({
        'crop': crop_type,
        'soil': soil_type,
        'fertilizer_optimization': npk,
        'irrigation_schedule': irrigation,
        'soil_restoration_tips': soil_tips,
        'crop_suitabilities': crop_suggestions
    }), 200

@recommendations_bp.route('/irrigation', methods=['GET'])
def get_irrigation():
    crop = request.args.get('crop', 'Rice')
    soil = request.args.get('soil', 'Loam')
    temp = request.args.get('temp', 25.0, type=float)
    rain = request.args.get('rain', 100.0, type=float)
    
    plan = advisor.get_irrigation_schedule(crop, soil, temp, rain)
    return jsonify(plan), 200

@recommendations_bp.route('/fertilizer', methods=['GET'])
def get_fertilizer():
    crop = request.args.get('crop', 'Rice')
    soil = request.args.get('soil', 'Loam')
    
    plan = advisor.get_fertilizer_plan(crop, soil)
    return jsonify(plan), 200

@recommendations_bp.route('/crop-suggestion', methods=['GET'])
def get_crop_suggestions():
    soil = request.args.get('soil', 'Loam')
    temp = request.args.get('temp', 25.0, type=float)
    rain = request.args.get('rain', 100.0, type=float)
    hum = request.args.get('hum', 60.0, type=float)
    
    suggestions = advisor.suggest_crops(soil, rain, temp, hum)
    return jsonify({'suggestions': suggestions}), 200
