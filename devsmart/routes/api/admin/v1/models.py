from flask import Blueprint, jsonify

# Lists available AI LLM models that can be used
@admin_bp.route('/v1/models', methods=['GET'])
def get_models():    
    # RESPONSE
    return jsonify({"message": "There are no models here... only supermodels"})
    

# updates available models list configuration of the application AI LLM models that can be used - jupyter
@admin_bp.route('/v1/models', methods=['PUT'])
def put_models():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "List of models updated succesfully"})
