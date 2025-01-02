import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)


API_KEY = os.getenv("GENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("API key for generative AI not set. Set GENAI_API_KEY environment variable.")

genai.configure(api_key=API_KEY)

# AI Model Configuration
GENERATION_CONFIG = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 300,
}

@app.route("/")
def home():
    """Render the home page."""
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    """Generate a response using the AI model."""
    try:
        # Retrieve the user's message
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Message content is missing."}), 400

        # Start a chat session and get a response
        model = genai.models.get_model("chat-bison-001")
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
