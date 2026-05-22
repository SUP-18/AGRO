from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.user import User
from app.models.prediction import Prediction
from app.models.disease_report import DiseaseReport
from app.utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required()
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_user_role(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json() or {}
    new_role = data.get('role')
    
    if not new_role or new_role not in ['farmer', 'expert', 'admin']:
        return jsonify({'error': 'Invalid role specify farmer, expert, or admin'}), 400
        
    user.role = new_role
    db.session.commit()
    return jsonify({
        'message': f'User role updated to {new_role} successfully',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    if user.role == 'admin':
        # Avoid locking out the last admin
        admin_count = User.query.filter_by(role='admin').count()
        if admin_count <= 1:
            return jsonify({'error': 'Cannot delete the only admin user in the system'}), 400
            
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required()
def get_system_stats():
    total_users = User.query.count()
    total_predictions = Prediction.query.count()
    total_reports = DiseaseReport.query.count()
    
    # Calculate role metrics
    farmers = User.query.filter_by(role='farmer').count()
    experts = User.query.filter_by(role='expert').count()
    admins = User.query.filter_by(role='admin').count()
    
    return jsonify({
        'stats': {
            'total_users': total_users,
            'total_predictions': total_predictions,
            'total_reports': total_reports,
            'roles': {
                'farmers': farmers,
                'experts': experts,
                'admins': admins
            },
            'system_health': 'Healthy',
            'ml_model_status': 'Active'
        }
    }), 200

@admin_bp.route('/broadcast', methods=['POST'])
@jwt_required()
@admin_required()
def broadcast_notification():
    data = request.get_json() or {}
    
    title = data.get('title')
    message = data.get('message')
    notif_type = data.get('type', 'info')
    
    if not title or not message:
        return jsonify({'error': 'Title and message are required'}), 400
        
    from app.models.notification import Notification
    users = User.query.all()
    
    for u in users:
        new_notif = Notification(
            user_id=u.id,
            title=title,
            message=message,
            type=notif_type
        )
        db.session.add(new_notif)
        
    db.session.commit()
    return jsonify({
        'message': f'Broadcast sent to all {len(users)} registered users.',
        'count': len(users)
    }), 201

