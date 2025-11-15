# For admin prompting to use for reconfiguration and improvement of the model and setup - jupyter
@app.route('/api/management/v1/improve', methods=['POST'])
def get_data():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "The application has been improved."})