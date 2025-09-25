import jwt
from datetime import datetime, timedelta
import json
from flask import Flask, request, jsonify
import requests 
from flask_cors import CORS

secret_key = 'ProtectYourSite'
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["null", "http://localhost:8000"]}})


@app.route('/generate', methods=['POST'])
def generate_token():
    data = request.json 
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    payload = data.copy()
    payload['exp'] = datetime.utcnow() + timedelta(hours=1) 
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    
    return jsonify({'token': token})


@app.route('/validate', methods=['POST'])
def validate_token():
    data = request.json 
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        payload = jwt.decode(data["token"], secret_key, algorithms=['HS256'])
        return jsonify({'success': "valid"})
    except:
        return jsonify({'success': "invalid"})


if __name__ == '__main__':
    app.run(debug=True)

