const socket = io(SERVER_URL);
function joinChat() {
  const senderName = document.getElementById('username').value;
  password = document.getElementById('password').value;
  socket.emit('new-user-joined', senderName, password);
  populateUserDropdown();
  const searchContainer = document.getElementById('search-container');
  searchContainer.style.display = 'block';
}
async function populateUserDropdown() {
  const senderName = document.getElementById('username').value;
  const userDropdown = document.getElementById('userDropdown');
  const response = await fetch(FETCH_USERS_URL);
  const allUsers = await response.json();
  const allUsersExceptCurrent = allUsers.filter(
    (user) => user.username !== senderName,
  );
  allUsersExceptCurrent.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.id;
    option.text = user.username;
    userDropdown.appendChild(option);
  });
}

async function startChat() {
  const receiverName = userDropdown.options[userDropdown.selectedIndex].text;
  const senderName = document.getElementById('username').value;
  const chatDive = document.getElementById('chatDiv');
  chatDive.innerHTML = `<div>Chat started with user ${receiverName}</div>`;
  const chatContainer = document.getElementById('chat-container');
  chatContainer.style.display = 'block';
  const FETCH_HISTORY_URL = `${SERVER_URL}${FETCH_CHAT_HISTORY_PATH}${senderName}/${receiverName}`;
  const history = await fetch(FETCH_HISTORY_URL);
  const allHistory = await history.json();
  const chatHistoryDiv = document.getElementById('chat-history');
  chatHistoryDiv.innerHTML = '';
  if (allHistory) {
    allHistory.forEach((chat) => {
      const chatItem = document.createElement('div');
      if (chat.sender_user_id.username === senderName)
        chatItem.textContent = `You: ${chat.message}`;
      else
        chatItem.textContent = `${chat.sender_user_id.username}: ${chat.message}`;

      chatHistoryDiv.appendChild(chatItem);
    });
  } else {
    chatHistoryDiv.appendChild(chatItem);
  }
}

socket.on('receive', (data) => {
  document.getElementById('chat').innerHTML +=
    `<p>${data.senderName}: ${data.message}</p>`;
});

function sendMessage() {
  const senderName = document.getElementById('username').value;
  const receiverName = userDropdown.options[userDropdown.selectedIndex].text;
  const messageInput = document.getElementById('message');
  const message = messageInput.value.trim();
  if (!message) {
    alert('Please enter something!!!');
  }
  socket.emit('send', { receiverName, senderName, message });
  document.getElementById('chat').innerHTML += `<p>You: ${message}</p>`;
}
