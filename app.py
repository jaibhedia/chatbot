import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

genai.configure(api_key=os.environ.get("AIzaSyDcZKOvda6Fasuz9NFPqdao4dG0YHpqIZY"))

# Initialize Flask app
app = Flask(__name__)

# AI Model configuration
GENERATION_CONFIG = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 300,
    "response_mime_type": "text/plain",
}

# Create the generative model instance
try:
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=GENERATION_CONFIG,
    )
except Exception as e:
    raise RuntimeError(f"Failed to initialize the generative model: {e}")

# Define routes
@app.route("/")
def home():
    """Render the home page."""
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    """Handle user input and generate a response using the AI model."""
    try:
        # Retrieve the user's message from the request
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Message content is missing."}), 400

        # Start a chat session and generate a response
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True)


