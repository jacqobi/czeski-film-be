from flask import Blueprint, jsonify
from . import user_bp

# Add another example route for handling data
@user_bp.route('/v1/completion', methods=['POST'])
def post_completion():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "Data received successfully", "data": data})
