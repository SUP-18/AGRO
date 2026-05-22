from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def admin_required():
    """Decorator to protect endpoints that require administrator privileges"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return jsonify({'error': 'Admin privileges required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def expert_required():
    """Decorator to protect endpoints that require agriculture expert privileges"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            if not user or user.role not in ['expert', 'admin']:
                return jsonify({'error': 'Expert or admin privileges required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
