from flask import Flask, jsonify, request
from config import get_config
from routes.api.admin.v1 import *
from routes.api.user.v1 import *

# Create a Flask application
app = Flask(__name__)
app.config.from_object(get_config())
app.register_blueprint(user_bp)
app.register_blueprint(admin_bp)
app.config['FLASK_ENV'] = 'collabothon25'

# Define a route for the root endpoint with a simple response
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": f"Welcome to the DevSmart smart DevOps AI agent - {app.config.get('FLASK_ENV', 'colabothon25')} \n {app.url_map}"})

@app.errorhandler(404)
def not_found(e):
    return jsonify({"status": 404, "error": "Not Found", "message": "The requested resource could not be found."})

# Run the Flask application
if __name__ == '__main__':
    app.run(ssl_context='adhoc', debug=True, port=8080)