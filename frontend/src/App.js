// src/App.js
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle the message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Send message to backend (Express API) and get the chatbot response
  const sendMessage = async () => {
    if (!message) return;

    setIsLoading(true);
    try {
      // Make POST request to the backend
      const res = await axios.post('http://localhost:3000/get_response', { message });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <div className="chat-container">
        <div className="chat-box">
          <div className="chat-message">
            <strong>You:</strong> {message}
          </div>
          {response && (
            <div className="chat-message">
              <strong>Bot:</strong> {response}
            </div>
          )}
        </div>
        <div className="input-section">
          <textarea
            className="message-input"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
          />
          <button className="send-button" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
