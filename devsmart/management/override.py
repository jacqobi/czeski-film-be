# Updates old prompt in the dabase - jupyter
@app.route('/api/v1/management/override', methods=['PATCH'])
def get_data():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "Prompt XXX updated succesfully"})