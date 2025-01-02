document.getElementById("send-btn").addEventListener("click", sendMessage);

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) {
        alert("Please enter a message before sending.");
        return;
    }

    addMessageToChat("user-message", userInput);

    fetch("/get_response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.response) {
                addMessageToChat("bot-response", data.response);
            } else {
                addMessageToChat("bot-response", "Sorry, I couldn't process your request.");
            }
        })
        .catch((error) => {
            addMessageToChat("bot-response", "An error occurred. Please try again.");
            console.error("Error:", error);
        });

    document.getElementById("user-input").value = "";
}

function addMessageToChat(className, message) {
    const chatLog = document.getElementById("chat-log");
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.textContent = message;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}
