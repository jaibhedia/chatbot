// index.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { OpenAI } = require("openai"); // Import OpenAI from the 'openai' package

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Provide your OpenAI API key here
});

// Define POST endpoint for chat responses
app.post("/get_response", async (req, res) => {
  const userMessage = req.body.message;

  // Ensure the message is provided
  if (!userMessage) {
    return res.status(400).json({ error: "Message content is missing." });
  }

  try {
    // Fetch a response from OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model you want to use
      messages: [{ role: "user", content: userMessage }],
    });

    // Extract the response text and send it to the frontend
    const botResponse = response.choices[0].message.content;
    return res.json({ response: botResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred with the OpenAI API." });
  }
});

// Serve static files for frontend
app.use(express.static("public"));

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
