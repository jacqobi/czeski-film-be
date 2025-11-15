from flask import Flask, jsonify, request
import management as m
import user as u

# Create a Flask application
app = Flask(__name__)

# Define a route for the root endpoint with a simple response
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the DevSmart smart DevOps AI agent."})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)