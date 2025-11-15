from flask import Flask, jsonify, request
from config import get_config
from routes.api.admin.v1 import *
from routes.api.user.v1 import *

from flask_cors import CORS

# Create a Flask application
app = Flask(__name__, static_folder=None)
app.config.from_object(get_config())
app.config['FLASK_ENV'] = 'collabothon25'

CORS(app, resources={r"/api/*": {"origins": "*"}})


app.register_blueprint(user_bp)
app.register_blueprint(admin_bp)

# Define a route for the root endpoint with a simple response
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": f"Welcome to the DevSmart smart DevOps AI agent - {app.config.get('FLASK_ENV', 'colabothon25')}"})

# Defines deboug routes for routes and blueprint registration
@app.route('/routes')
def get_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "url": str(rule)
        })
    return jsonify(routes)

@app.errorhandler(404)
def not_found(e):
    return jsonify({"status": 404, "error": "Not Found", "message": "The requested resource could not be found."}), 404

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=8080)