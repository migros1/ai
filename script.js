const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const languageSelect = document.getElementById('language-select');

const apiUrl = 'https://darkness.ashlynn.workers.dev/chat/?prompt=';
const model = 'model=mistralai/Mixtral-8x7B-Instruct-v0.1';
let conversationHistory = [];

// Mesajları ekle
function appendMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}-message`;
    messageElement.innerHTML = message; // innerHTML kullanarak kodu ekliyoruz
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Kod bloğu oluştur
function createCodeBlock(code) {
    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-container';
    
    const codeElement = document.createElement('pre');
    codeElement.textContent = code;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code';
    copyBtn.textContent = 'Kopyala';
    copyBtn.onclick = function() {
        navigator.clipboard.writeText(code).then(() => {
            alert('Kod kopyalandı!');
        });
    };

    codeContainer.appendChild(copyBtn);
    codeContainer.appendChild(codeElement);
    return codeContainer;
}

// Geçmişi localStorage'a kaydet
function saveToLocalStorage() {
    const chatHistory = chatBox.innerHTML;
    localStorage.setItem('chatHistory', chatHistory);
}

// LocalStorage'dan geçmişi yükle
function loadFromLocalStorage() {
    const username = localStorage.getItem('username');
    if (username) {
        const chatHistory = localStorage.getItem('chatHistory');
        if (chatHistory) {
            chatBox.innerHTML = chatHistory;
        }
        appendMessage(`Hoş geldiniz, ${username}!`, 'bot'); // Kullanıcı adını göster
    }
}

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    const selectedLanguage = languageSelect.value; // Seçilen dili al

    if (userMessage) {
        appendMessage(userMessage, 'user'); // Kullanıcı mesajı
        conversationHistory.push(userMessage); // Geçmişe kullanıcının mesajını ekle
        userInput.value = '';

        // Geçmiş mesajları kullanarak API'ye yeni bir istek gönder
        const fullPrompt = conversationHistory.join('\n'); // Geçmişi birleştir
        try {
            const response = await fetch(apiUrl + encodeURIComponent(fullPrompt) + '&' + model);
            const data = await response.json();
            const botMessage = data.response; // API'den gelen yanıt

            // Kod yazma özelliği için
            const codeBlock = createCodeBlock(botMessage);
            appendMessage(codeBlock.outerHTML, 'bot'); // Bot mesajı olarak kodu ekle

            conversationHistory.push(botMessage); // Geçmişe botun yanıtını ekle
            saveToLocalStorage(); // Her gönderimden sonra kaydet
        } catch (error) {
            appendMessage('API ile iletişim kurulurken bir hata oluştu.', 'bot');
        }
    }
});

// Kullanıcı adı girişi ve kaydetme
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        $('#loginModal').modal('hide');
        loadFromLocalStorage();
    }
});

// Sayfa yüklendiğinde geçmişi yükle
window.onload = loadFromLocalStorage;