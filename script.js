
let currentUser = localStorage.getItem('username');
if (currentUser) {
    if (currentUser === 'owner') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('owner-inbox').style.display = 'block';
        loadInbox();
    } else {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'block';
        loadChat();
    }
}

document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username.length >= 3 && username.length <= 10 && !username.includes(' ')) {
        localStorage.setItem('username', username);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'block';
        document.getElementById('chat-page').classList.add('fade-in');
        currentUser = username;
        loadChat();
    } else {
        alert('Username must be 3 to 10 characters long with no spaces.');
    }
});

document.getElementById('owner-btn').addEventListener('click', function() {
    const password = prompt('Enter owner password:');
    if (password === 'DeepSeek12$') {
        localStorage.setItem('username', 'owner');
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
        sendMessage(currentUser, message);
        document.getElementById('chat-input').value = '';
    }
});

document.getElementById('reply-btn').addEventListener('click', function() {
    const reply = document.getElementById('inbox-input').value;
    if (reply) {
        const userChat = document.querySelector('.user[data-user]').getAttribute('data-user');
        sendMessage('owner', reply, userChat);
        document.getElementById('inbox-input').value = '';
    }
});

function sendMessage(username, message, recipient = null) {
    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, message: message, recipient: recipient }),
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              if (username === 'owner') {
                  loadInboxChat(recipient);
              } else {
                  loadChat();
              }
          }
      });
}

function loadChat() {
    fetch(`/get_chat/${currentUser}`)
        .then(response => response.json())
        .then(data => {
            const chatWindow = document.getElementById('chat-window');
            chatWindow.innerHTML = '';
            data.messages.forEach(msg => {
                chatWindow.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.message}</div>`;
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });
}

function loadInbox() {
    fetch('/get_messages')
        .then(response => response.json())
        .then(data => {
            const inboxList = document.getElementById('inbox-list');
            inboxList.innerHTML = '';
            data.messages.forEach(msg => {
                if (msg.recipient === null) {
                    inboxList.innerHTML += `<div class="user" data-user="${msg.username}">${msg.username}</div>`;
                }
            });
            document.querySelectorAll('.user').forEach(user => {
                user.addEventListener('click', function() {
                    document.getElementById('inbox-list').style.display = 'none';
                    document.getElementById('inbox-chat').style.display = 'block';
                    const userChat = this.getAttribute('data-user');
                    loadInboxChat(userChat);
                });
            });
        });
}

function loadInboxChat(userChat) {
    fetch(`/get_chat/${userChat}`)
        .then(response => response.json())
        .then(data => {
            const inboxWindow = document.getElementById('inbox-window');
            inboxWindow.innerHTML = '';
            data.messages.forEach(msg => {
                inboxWindow.innerHTML += `<div><strong>${msg.username}:</strong> ${msg.message}</div>`;
            });
            inboxWindow.scrollTop = inboxWindow.scrollHeight;
        });
}

setInterval(() => {
    if (currentUser === 'owner') {
        loadInbox();
    } else {
        loadChat();
    }
}, 1000);
