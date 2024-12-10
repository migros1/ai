let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;

document.addEventListener('DOMContentLoaded', () => {
    chatHistory.forEach(entry => displayMessage(entry.message, entry.sender));
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        displayMessage(userInput, 'user');
        chatHistory.push({ sender: 'user', message: userInput });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        document.getElementById('user-input').value = '';
        getBotResponse(chatHistory.map(entry => entry.message).join('\n'));
    }
});

document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
});

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotResponse(history) {
    document.getElementById('loading-indicator').style.display = 'block';

    try {
        const response = await fetch('https://darkness.ashlynn.workers.dev/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: history,
                model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
            })
        });

        if (response.ok) {
            const data = await response.json();
            const botResponse = data.response;
            displayMessage(botResponse, 'bot');
            chatHistory.push({ sender: 'bot', message: botResponse });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } else {
            displayMessage("Bir hata oluştu. Lütfen tekrar deneyin.", 'bot');
        }
    } catch (error) {
        console.error("API bağlantı hatası:", error);
        displayMessage("Bağlantı hatası. Lütfen internetinizi kontrol edin ve tekrar deneyin.", 'bot');
    } finally {
        document.getElementById('loading-indicator').style.display = 'none';
    }
}