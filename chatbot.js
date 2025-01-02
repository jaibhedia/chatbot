document.getElementById("send-btn").addEventListener("click", sendMessage);

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    
    // Ensure the input field is not empty or only whitespace
    if (!userInput.trim()) {
        alert("Please enter a message before sending.");
        return;
    }

    // Display the user's message in the chat log
    addMessageToChat("user-message", userInput);

    // Send the user's message to the Flask backend
    fetch("/get_response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }), // Pass the user input in JSON format
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Check if a response is present
            if (data.response) {
                addMessageToChat("bot-response", data.response); // Display the bot's response
            } else if (data.error) {
                addMessageToChat("bot-response", `Error: ${data.error}`);
            } else {
                addMessageToChat("bot-response", "Sorry, no response was received.");
            }
        })
        .catch((error) => {
            // Handle any errors that occurred during the fetch process
            addMessageToChat("bot-response", "Sorry, an error occurred. Please try again.");
            console.error("Error:", error);
        });

    // Clear the input field
    document.getElementById("user-input").value = "";
}

function addMessageToChat(className, message) {
    const chatLog = document.getElementById("chat-log");

    // Ensure the chat log element exists
    if (!chatLog) {
        console.error("Chat log element not found.");
        return;
    }

    // Create a new message div
    const messageDiv = document.createElement("div");
    messageDiv.className = className; // Set the CSS class for styling
    messageDiv.textContent = message; // Set the message content
    chatLog.appendChild(messageDiv); // Append the message to the chat log

    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;
}
