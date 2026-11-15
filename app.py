from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

submissions = []

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/api/contact", methods=["POST"])
def handle_contact():
    data = request.get_json() or {}
    submissions.append(data)
    return jsonify({"status": "success", "message": "Message received by Python backend!"})

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
