import os
import smtplib
from email.message import EmailMessage
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

submissions = []

def send_email_notification(name, email, topic, message):
    gmail_user = os.environ.get("GMAIL_USER")
    gmail_pass = os.environ.get("GMAIL_APP_PASSWORD")
    if not gmail_user or not gmail_pass:
        return

    msg = EmailMessage()
    msg["Subject"] = f"Portfolio Message from {name}: {topic}"
    msg["From"] = gmail_user
    msg["To"] = gmail_user
    msg["Reply-To"] = email
    msg.set_content(
        f"New message from your portfolio website!\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Topic: {topic}\n\n"
        f"Message:\n{message}\n"
    )

    with smtplib.SMTP_SSL("://gmail.com", 465) as smtp:
        smtp.login(gmail_user, gmail_pass)
        smtp.send_message(msg)

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/api/contact", methods=["POST"])
def handle_contact():
    data = request.get_json() or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    topic = str(data.get("topic", "General inquiry")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"detail": "Please fill in your name, email, and message."}), 400

    entry = {
        "name": name,
        "email": email,
        "topic": topic,
        "message": message,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    submissions.append(entry)

    try:
        send_email_notification(name, email, topic, message)
    except Exception as e:
        print("Email error:", e)

    return jsonify({
        "status": "success",
        "message": f"Thanks {name}! Your message has been received and logged by the Python backend."
    })

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "backend": "Python Flask",
        "messages_logged": len(submissions)
    })

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
