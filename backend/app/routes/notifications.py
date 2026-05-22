from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification import Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify({'notifications': [n.to_dict() for n in notifications]}), 200

@notifications_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(notif_id):
    user_id = int(get_jwt_identity())
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'error': 'Notification not found'}), 404
        
    notif.read = True
    db.session.commit()
    return jsonify({
        'message': 'Notification marked as read',
        'notification': notif.to_dict()
    }), 200

@notifications_bp.route('/', methods=['POST'])
@jwt_required()
def create_notification():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    title = data.get('title')
    message = data.get('message')
    notif_type = data.get('type', 'info')
    
    if not title or not message:
        return jsonify({'error': 'Title and message are required'}), 400
        
    new_notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type
    )
    
    db.session.add(new_notif)
    db.session.commit()
    return jsonify({
        'message': 'Notification created successfully',
        'notification': new_notif.to_dict()
    }), 201

@notifications_bp.route('/<int:notif_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notif_id):
    user_id = int(get_jwt_identity())
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'error': 'Notification not found'}), 404
        
    db.session.delete(notif)
    db.session.commit()
    return jsonify({'message': 'Notification deleted successfully'}), 200
