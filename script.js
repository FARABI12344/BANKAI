let currentUser = localStorage.getItem('username');
if (currentUser) {
    if (currentUser === 'owner') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('owner-inbox').style.display = 'block';
        loadInbox();
    } else {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'block';
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
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, message: message }),
        }).then(response => response.json())
          .then(data => {
              if (data.status === 'success') {
                  const chatWindow = document.getElementById('chat-window');
                  chatWindow.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
                  document.getElementById('chat-input').value = '';
                  chatWindow.scrollTop = chatWindow.scrollHeight;
              }
          });
    }
});

function loadInbox() {
    fetch('/get_messages')
        .then(response => response.json())
        .then(data => {
            const inboxList = document.getElementById('inbox-list');
            inboxList.innerHTML = '';
            data.messages.forEach(msg => {
                inboxList.innerHTML += `<div class="user" data-user="${msg.username}">${msg.username}</div>`;
            });
            document.querySelectorAll('.user').forEach(user => {
                user.addEventListener('click', function() {
                    document.getElementById('inbox-list').style.display = 'none';
                    document.getElementById('inbox-chat').style.display = 'block';
                    const userChat = this.getAttribute('data-user');
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
                });
            });
        });
}

document.getElementById('reply-btn').addEventListener('click', function() {
    const reply = document.getElementById('inbox-input').value;
    if (reply) {
        const userChat = document.querySelector('.user[data-user]').getAttribute('data-user');
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: 'owner', message: reply, recipient: userChat }),
        }).then(response => response.json())
          .then(data => {
              if (data.status === 'success') {
                  const inboxWindow = document.getElementById('inbox-window');
                  inboxWindow.innerHTML += `<div><strong>Owner:</strong> ${reply}</div>`;
                  document.getElementById('inbox-input').value = '';
                  inboxWindow.scrollTop = inboxWindow.scrollHeight;
              }
          });
    }
});

setInterval(() => {
    if (currentUser === 'owner') {
        loadInbox();
    } else {
        fetch('/get_chat/' + currentUser)
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
}, 1000);
