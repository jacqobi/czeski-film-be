from flask import Flask, jsonify, request
from config import get_config
import management as m
import user as u

# Create a Flask application
app = Flask(__name__)
app.config.from_object(get_config())

# Define a route for the root endpoint with a simple response
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": f"Welcome to the DevSmart smart DevOps AI agent - {app.config.get('FLASK_ENV', '')}"})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=8080)