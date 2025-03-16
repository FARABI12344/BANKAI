from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

messages = []

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    messages.append({'username': data['username'], 'message': data['message'], 'recipient': data.get('recipient', None)})
    return jsonify({'status': 'success'})

@app.route('/get_messages', methods=['GET'])
def get_messages():
    user_messages = [msg for msg in messages if msg['recipient'] is None]
    return jsonify({'messages': user_messages})

@app.route('/get_chat/<username>', methods=['GET'])
def get_chat(username):
    user_chat = [msg for msg in messages if msg['recipient'] == username or msg['username'] == username]
    return jsonify({'messages': user_chat})

if __name__ == '__main__':
    app.run(debug=True)
