from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

submissions = []

@app.route("/api/contact", methods=["POST"])
def handle_contact():
    data = request.get_json() or {}
    submissions.append(data)
    return jsonify({"status": "success", "message": "Message received by Python backend!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)