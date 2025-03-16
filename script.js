document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username.length >= 3 && username.length <= 10 && !username.includes(' ')) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'block';
        document.getElementById('chat-page').classList.add('fade-in');
    } else {
        alert('Username must be 3 to 10 characters long with no spaces.');
    }
});

document.getElementById('owner-btn').addEventListener('click', function() {
    const password = prompt('Enter owner password:');
    if (password === 'DeepSeek12$') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('owner-inbox').style.display = 'block';
        document.getElementById('owner-inbox').classList.add('fade-in');
        loadInbox();
    } else {
        alert('Incorrect password.');
    }
});

document.getElementById('send-btn').addEventListener('click', function() {
    const message = document.getElementById('chat-input').value;
    if (message) {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        document.getElementById('chat-input').value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
        setTimeout(() => {
            chatWindow.innerHTML += `<div><strong>Bot:</strong> Thanks for sending message! Please wait.</div>`;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 1000);
    }
});

function loadInbox() {
    const inboxList = document.getElementById('inbox-list');
    inboxList.innerHTML = '<div class="user" data-user="Farabi">Farabi</div>';
    document.querySelectorAll('.user').forEach(user => {
        user.addEventListener('click', function() {
            document.getElementById('inbox-list').style.display = 'none';
            document.getElementById('inbox-chat').style.display = 'block';
            const userChat = this.getAttribute('data-user');
            document.getElementById('inbox-window').innerHTML = `<div><strong>${userChat}:</strong> They run only...</div>`;
        });
    });
}

document.getElementById('reply-btn').addEventListener('click', function() {
    const reply = document.getElementById('inbox-input').value;
    if (reply) {
        const inboxWindow = document.getElementById('inbox-window');
        inboxWindow.innerHTML += `<div><strong>Owner:</strong> ${reply}</div>`;
        document.getElementById('inbox-input').value = '';
        inboxWindow.scrollTop = inboxWindow.scrollHeight;
    }
});
