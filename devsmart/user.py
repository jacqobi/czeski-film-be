# Add another example route for handling data
@app.route('/api/user/completion', methods=['POST'])
def get_data():
    # Extract JSON data sent in the POST request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Return the received data along with a message
    return jsonify({"message": "Data received successfully", "data": data})
