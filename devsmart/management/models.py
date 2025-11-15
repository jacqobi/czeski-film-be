# Lists available AI LLM models that can be used
@app.route('/api/management/v1/models', methods=['GET'])
def get_data():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # RESPONSE
    return jsonify({"message": "There are no models here... only supermodels"})
    

# updates available models list configuration of the application AI LLM models that can be used - jupyter
@app.route('/api/management/v1/models', methods=['PUT'])
def get_data():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "List of models updated succesfully"})
