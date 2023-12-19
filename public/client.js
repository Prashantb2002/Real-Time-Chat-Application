const socket = io();
let userName;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    userName = prompt('Please enter your name: ');
} while (!userName);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim()
    };

    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Receive messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

// Display user joined message
socket.on('userJoined', (user) => {
    let joinMessage = {
        user: 'System',
        message: `${user} joined the chat`
    };
    appendMessage(joinMessage, 'system');
    scrollToBottom();
});

// Display user left message
socket.on('userLeft', (user) => {
    let leaveMessage = {
        user: 'System',
        message: `${user} left the chat`
    };
    appendMessage(leaveMessage, 'system');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
