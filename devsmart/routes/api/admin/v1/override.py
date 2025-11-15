from flask import Blueprint, jsonify
from . import admin_bp

# Updates old prompt in the dabase - jupyter
@admin_bp.route('/v1/override', methods=['PATCH'])
def patch_override():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "Prompt XXX updated succesfully"})