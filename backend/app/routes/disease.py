import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.disease_report import DiseaseReport
from app.ml.disease_model import DiseaseDetector

disease_bp = Blueprint('disease', __name__)
detector = DiseaseDetector()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@disease_bp.route('/detect', methods=['POST'])
@jwt_required()
def detect_disease():
    user_id = int(get_jwt_identity())
    
    # Check if image file exists in payload
    file = request.files.get('image')
    filename = None
    saved_path = None
    
    if file and file.filename != '':
        if not allowed_file(file.filename):
            return jsonify({'error': 'Allowed image formats are png, jpg, jpeg, gif'}), 400
            
        filename = secure_filename(file.filename)
        upload_dir = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_dir, exist_ok=True)
        
        saved_path = os.path.join(upload_dir, filename)
        file.save(saved_path)
        
    # Diagnose using ML engine
    res = detector.detect(saved_path, filename=filename)
    
    # Save Report record
    new_report = DiseaseReport(
        user_id=user_id,
        image_path=filename or 'mock_leaf_scan.jpg',
        disease_name=res['disease_name'],
        confidence=res['confidence'],
        treatment=res['treatment']
    )
    
    try:
        db.session.add(new_report)
        db.session.commit()
        
        return jsonify({
            'message': 'Leaf analysis complete',
            'report': new_report.to_dict(),
            'details': {
                'severity': res['severity'],
                'description': res['description']
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to store pathology report: {str(e)}'}), 500

@disease_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = int(get_jwt_identity())
    reports = DiseaseReport.query.filter_by(user_id=user_id).order_by(DiseaseReport.created_at.desc()).all()
    return jsonify({'reports': [r.to_dict() for r in reports]}), 200

@disease_bp.route('/reports/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    user_id = int(get_jwt_identity())
    report = DiseaseReport.query.filter_by(id=report_id, user_id=user_id).first()
    if not report:
        return jsonify({'error': 'Report not found'}), 404
        
    return jsonify({'report': report.to_dict()}), 200
