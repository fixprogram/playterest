window.chat = function (userID, userName) {

    const socket = io('https://myappest.herokuapp.com'); // http://localhost:3000

    const chatTabs = document.querySelector('.chat-tabs');
    const tabs = chatTabs.querySelectorAll('.tab');

    const tabPersonal = chatTabs.querySelector('.tab--personal');

    const chatContent = document.querySelector('.chat-content');

    let usersList = chatContent.querySelector('.users-list');
    let messagesLists = chatContent.querySelectorAll('.messages');
    let messageWorldText = chatContent.querySelector('#messageWorldText');
    let sendWorldBtn = chatContent.querySelector('#sendWorld');

    sendWorldBtn.addEventListener('click', () => {
        tabs.forEach((tab) => {
            if (tab.classList.contains('active')) sendMessage(messageWorldText, tab.textContent, tab.textContent);
        });
    });

    messageWorldText.addEventListener('keyup', function (evt) {
        if (evt.code === 'Enter') {
            tabs.forEach((tab) => {
                if (tab.classList.contains('active')) sendMessage(messageWorldText, tab.textContent, tab.textContent);
            });
        }
    });

    function sendMessage(input, chat, friendName) {
        let message = input.value;
        input.value = '';

        if (message) {
            if (chat === 'Общий') {
                socket.emit('sendMessage', {message, userID, room: 'world'}, () => console.log('1'));
            } else if (chat === 'Комната') {
                socket.emit('sendMessage', {message, userID, room: 'room'}, () => console.log('1'));
            } else {
                let time = new Date();
                socket.emit('sendMessage', {message, userID, room: 'personal'}, () => console.log('1'));
                socket.emit('messageToFriend', {me: userName, friendName, message, time: time.getTime()}, () => console.log('1'));
            }
        }
    }

    window.renderMessage = function (data) {
        if (data.room === 'world') {
            let item = document.createElement('p');
            item.innerHTML = '<span class="chat-user">' + data.user + ':</span> ' + data.text;
            messagesLists[0].appendChild(item);
            messagesLists[0].scrollTo(0, 10000);
        } else if (data.room === 'room') {
            let item = document.createElement('p');
            item.innerHTML = '<span class="chat-user">' + data.user + ':</span> ' + data.text;
            messagesLists[1].appendChild(item);
            messagesLists[1].scrollTo(0, 10000);
        } else if(data.room === 'personal') {
            let item = document.createElement('p');
            if(data.user === userName) {
                item.innerHTML = data.text;
                item.style.marginLeft = 'auto';
            } else {
                item.innerHTML = '<span class="chat-user">' + data.user + ':</span> ' + data.text;
            }
            messagesLists[2].appendChild(item);
            messagesLists[2].scrollTo(0, 10000);
        }
    };

    window.renderUsers = function (users, userName) {
        usersList.innerHTML = '';
        users.forEach((user) => {
            let item = document.createElement('a');
            item.href = '/profile?id=' + user.id;
            item.innerHTML = user.userName;
            if (user.userName === userName.toLowerCase()) item.classList.add('me');
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
