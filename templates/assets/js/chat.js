window.chat = function(userID) {

    const socket = io('http://localhost:3000'); // http://localhost:3000

    const chatWorld = document.querySelector('.chat--world');
    const chatRoom = document.querySelector('.chat--room');

    let usersList = chatWorld.querySelector('.users-list');
    let messagesWorldList = chatWorld.querySelector('.messages');
    let messagesRoomList = chatRoom.querySelector('.messages');
    let messageWorldText = chatWorld.querySelector('#messageWorldText');
    let messageRoomText = chatRoom.querySelector('#messageRoomText');
    let sendWorldBtn = chatWorld.querySelector('#sendWorld');
    let sendRoomBtn = chatRoom.querySelector('#sendRoom');

    sendWorldBtn.addEventListener('click', () => sendMessage(messageWorldText, 'world'));

    sendRoomBtn.addEventListener('click', () => sendMessage(messageRoomText, 'room'));

    messageWorldText.addEventListener('keyup', function (evt) {
        if (evt.code === 'Enter') sendMessage(messageWorldText, 'world');
    });

    messageRoomText.addEventListener('keyup', function (evt) {
        if (evt.code === 'Enter') sendMessage(messageRoomText, 'room');
    });

    function sendMessage(input, chat) {
        let message = input.value;
        input.value = '';

        if (message) {
            socket.emit('sendMessage', {message, userID, room: chat}, () => console.log('1'));
        }
    }

    window.renderMessage = function(data) {
        if (data.room === 'world') {
            let item = document.createElement('p');
            item.innerHTML = '<span class="chat-user">' + data.user + ':</span> ' + data.text;
            messagesWorldList.appendChild(item);
            messagesWorldList.scrollTo(0, 10000);
        } else {
            if (data.room === 'room') {
                let item = document.createElement('p');
                item.innerHTML = data.user + ': ' + data.text;
                messagesRoomList.appendChild(item);
                messagesRoomList.scrollTo(0, 10000);
            }
        }
    };

    window.renderUsers = function(users, userName) {
        usersList.innerHTML = '';
        users.forEach((user) => {
            let item = document.createElement('a');
            item.href = '/profile?id=' + user.id;
            item.innerHTML = user.userName;
            if(user.userName === userName.toLowerCase()) item.classList.add('me');
            item.addEventListener('click', function (evt) {
                evt.preventDefault();
                if (userName !== user.userName) socket.emit('addNotice', {
                    socket: user.socketID,
                    fromUser: userName,
                    userID: user.id
                });
            });
            usersList.appendChild(item);
        });
    };
};
