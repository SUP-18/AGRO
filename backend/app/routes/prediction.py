from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.prediction import Prediction, Recommendation
from app.ml.crop_yield_model import CropYieldPredictor
from app.ml.recommendation_engine import RecommendationEngine

prediction_bp = Blueprint('prediction', __name__)
predictor = CropYieldPredictor()
advisor = RecommendationEngine()

@prediction_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    crop_type = data.get('crop_type')
    soil_type = data.get('soil_type')
    rainfall = data.get('rainfall')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    fertilizer_usage = data.get('fertilizer_usage')
    land_area = data.get('land_area')
    
    if any(v is None for v in [crop_type, soil_type, rainfall, temperature, humidity, fertilizer_usage, land_area]):
        return jsonify({'error': 'All agricultural features are required'}), 400
        
    try:
        # Run ML Prediction
        pred_res = predictor.predict(data)
        
        # Save Prediction record
        new_pred = Prediction(
            user_id=user_id,
            crop_type=crop_type,
            soil_type=soil_type,
            rainfall=float(rainfall),
            temperature=float(temperature),
            humidity=float(humidity),
            fertilizer_usage=float(fertilizer_usage),
            land_area=float(land_area),
            predicted_yield=pred_res['predicted_yield'],
            confidence=pred_res['confidence']
        )
        db.session.add(new_pred)
        
        # Generate associated recommendations
        npk_plan = advisor.get_fertilizer_plan(crop_type, soil_type)
        irrig_plan = advisor.get_irrigation_schedule(crop_type, soil_type, temperature, rainfall)
        
        # Add NPK Recommendation
        npk_rec = Recommendation(
            user_id=user_id,
            type='fertilizer',
            content=f"NPK Optimization Strategy: Apply Nitrogen {npk_plan['nitrogen']} kg/ha, Phosphorus {npk_plan['phosphorus']} kg/ha, Potassium {npk_plan['potassium']} kg/ha. Guidelines: {npk_plan['guidelines']}",
            priority='High'
        )
        
        # Add Irrigation Recommendation
        irrig_rec = Recommendation(
            user_id=user_id,
            type='irrigation',
            content=f"Irrigation Schedule ({irrig_plan['recommended_frequency']}): Recommended water volume is {irrig_plan['recommended_volume']}. Schedule: Day-wise watering action depends on soil moisture checks.",
            priority='Medium'
        )
        
        db.session.add(npk_rec)
        db.session.add(irrig_rec)
        db.session.commit()
        
        return jsonify({
            'message': 'Prediction generated successfully',
            'prediction': new_pred.to_dict(),
            'recommendations': [npk_rec.to_dict(), irrig_rec.to_dict()]
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Prediction model processing failed: {str(e)}'}), 500

@prediction_bp.route('/', methods=['GET'])
@jwt_required()
def get_predictions():
    user_id = int(get_jwt_identity())
    predictions = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).all()
    return jsonify({'predictions': [p.to_dict() for p in predictions]}), 200

@prediction_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'predictions': [p.to_dict() for p in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@prediction_bp.route('/<int:pred_id>', methods=['GET'])
@jwt_required()
def get_prediction(pred_id):
    user_id = int(get_jwt_identity())
    pred = Prediction.query.filter_by(id=pred_id, user_id=user_id).first()
    if not pred:
        return jsonify({'error': 'Prediction record not found'}), 404
        
    return jsonify({'prediction': pred.to_dict()}), 200
