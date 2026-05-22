import re
from datetime import datetime

def validate_email(email):
    """Validates email format using regex"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

def format_date(date_obj):
    """Formats datetime to string ISO representation"""
    if not date_obj:
        return None
    return date_obj.isoformat()

def paginate_query(query, page, per_page):
    """Paginates an SQLAlchemy query object"""
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        'items': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }
