document.addEventListener('DOMContentLoaded', function() {
    console.log('Uygulama yüklendi');

    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');

    async function sendChatPrompt(prompt) {
        const apiUrl = `https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(prompt)}&model=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('API isteği başarısız oldu');
            }
            const data = await response.json();
            appendMessage('Bot', data.reply || 'Yanıt alınamadı');
        } catch (error) {
            console.error('API hatası:', error);
            appendMessage('Bot', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender.toLowerCase()}`;
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener('click', function() {
        const prompt = userInput.value.trim();
        if (prompt) {
            appendMessage('Kullanıcı', prompt);
            sendChatPrompt(prompt);
            userInput.value = '';
        } else {
            alert('Lütfen bir mesaj yazın.');
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});