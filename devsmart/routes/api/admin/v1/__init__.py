from flask import Blueprint

admin_bp = Blueprint('user', __name__, url_prefix='/api/admin')