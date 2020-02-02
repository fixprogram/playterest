window.renders = function (userName) {

    const socket = io('http://localhost:3000'); // http://localhost:3000

    window.renderGame = function (game, list, icon, id) {
        let gameItem = document.createElement('li');
        let gameName = document.createElement('p');
        let gameCheckbox = document.createElement('input');
        gameCheckbox.type = 'checkbox';
        gameCheckbox.id = id;
        gameCheckbox.classList.add('visually-hidden');
        let gameLabel = document.createElement('label');
        gameLabel.htmlFor = id;
        if (icon) {
            let gameIcon = document.createElement('img');
            gameIcon.src = icon;
            gameLabel.appendChild(gameIcon);
        }
        gameName.innerText = game;
        gameLabel.appendChild(gameName);
        gameItem.appendChild(gameCheckbox);
        gameItem.appendChild(gameLabel);
        list.appendChild(gameItem);
    };

    window.renderFriend = function (name, list, icon) {
        let friendItem = document.createElement('li');
        let friendName = document.createElement('p');
        if (icon) {
            let friendIcon = document.createElement('img');
            friendIcon.src = icon;
            friendItem.appendChild(friendIcon);
        }
        let buttonMessages = document.createElement('button');
        buttonMessages.classList.add('user-messages');
        friendName.innerText = name;
        friendItem.appendChild(friendName);
        friendItem.appendChild(buttonMessages);
        list.appendChild(friendItem);

        buttonMessages.addEventListener('click', () => {
            openFriendMessages(buttonMessages);
        });
    };

    window.renderNotice = () => {

    };

    window.renderDialog = (data, list) => {
        let dialog = document.createElement('li');
        let dialogArticle = document.createElement('article');
        let friendName = document.createElement('p');
        friendName.classList.add('friend');
        let lastMsg = document.createElement('p');
        let friendIcon = document.createElement('img');
        friendIcon.src = data.icon;
        dialog.appendChild(friendIcon);

        let lastMessage = data.messages[data.messages.length - 1];
        if(lastMessage.me === userName) lastMessage.me = 'Вы';
        lastMsg.innerHTML = '<span class="author">' + lastMessage.me + ': </span>' + lastMessage.text;

        friendName.innerText = data.name;
        dialogArticle.appendChild(friendName);
        dialogArticle.appendChild(lastMsg);

        let date = new Date(lastMessage.time);
        let hours = date.getHours();
        let minutes = '0' + date.getMinutes();

        let time = document.createElement('span');
        time.classList.add('time');
        time.innerHTML = hours + ':' + minutes.substr(-2);

        dialog.appendChild(time);
        dialog.appendChild(dialogArticle);
        list.appendChild(dialog);

        dialog.addEventListener('click', () => {
            let friends = document.querySelectorAll('.friends-list li');
            friends.forEach((friend) => {
                if(dialog.querySelector('p.friend').textContent === friend.querySelector('p').textContent) {
                    openFriendMessages(friend.querySelector('.user-messages'));
                }
            });
        });

    };

    window.renderRoom = function (title, list, roomID) {
        let roomItem = document.createElement('li');
        let roomTitle = document.createElement('p');
        roomTitle.innerText = title;
        roomItem.appendChild(roomTitle);

        roomTitle.addEventListener('click', () => {
            socket.emit('joinRoom', {userName: title, me: userName, roomID});
        });

        list.appendChild(roomItem);
    };

    window.renderPersonal = (msg, list) => {
        let message = document.createElement('li');
        if (msg.me === userName || msg.user === userName.toLowerCase()) {
            message.classList.add('fromMe');
        }

        let date = new Date(msg.time);
        let day = date.getUTCDate();
        let hours = date.getHours();
        let minutes = '0' + date.getMinutes();

        message.innerHTML = '<p>' + msg.text + '</p>' + '<span class="time">' + hours + ':' + minutes.substr(-2) + '</span>';
        list.appendChild(message);
    };

    function openFriendMessages(buttonMessages) {
        const parent = buttonMessages.parentElement;
        const friendName = parent.querySelector('p');
        const friendIcon = parent.querySelector('img').src;
        const tabs = document.querySelectorAll('.chat-tabs .tab');
        const tabsContent = document.querySelectorAll('.chat-content .messages');

        tabs.forEach((tab) => tab.classList.remove('active'));
        tabsContent.forEach((content) => content.classList.remove('active'));
        tabs.forEach((tabItem, i) => {
            if (tabItem.classList.contains('tab--personal')) {
                tabsContent[i].classList.add('active');
                tabItem.style.display = 'block';
                tabItem.querySelector('.personal-chat-name').innerHTML = friendName.textContent;
                if (friendName.classList.contains('online')) tabItem.querySelector('.personal-chat-name').classList.add('online');
                tabItem.querySelector('.personal-chat-icon').src = friendIcon;
                tabItem.classList.add('active');
            }
        });

        window.changeTemplateMessage();

        socket.emit('friendMessages', {me: userName, name: friendName.textContent});

        socket.emit('removeNotices', ({me: userName, friend: friendName.textContent}));
    }

};