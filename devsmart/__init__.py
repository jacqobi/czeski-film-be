from flask import FLASK_APP

from .routes.api.management.v1 import models, override
from .routes.api.users.v1 import completion

def create_app():
    app = Flask(__name__)

    app.register_blueprint(user_bp)
    app.register_blueprint(admin_bp)

    return app