window.renders = function(userName) {

    const socket = io('https://myappest.herokuapp.com/'); // http://localhost:3000

    window.renderGame = function(game, list, icon, id) {
        let gameItem = document.createElement('li');
        let gameName = document.createElement('p');
        let gameCheckbox = document.createElement('input');
        gameCheckbox.type = 'checkbox';
        gameCheckbox.id = id;
        gameCheckbox.classList.add('visually-hidden');
        let gameLabel = document.createElement('label');
        gameLabel.htmlFor = id;
        if(icon) {
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

    window.renderFriend = function(name, list, icon) {
        let friendItem = document.createElement('li');
        let friendName = document.createElement('p');
        if(icon) {
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
            buttonMessages.disabled = true;
        });
    };

    window.renderNotice = function() {

    };

    window.renderRoom = function(title, list) {
        let roomItem = document.createElement('li');
        let roomTitle = document.createElement('p');
        roomTitle.innerText = title;
        roomItem.appendChild(roomTitle);

        roomTitle.addEventListener('click', () => {
           socket.emit('joinRoom', { userName: title, me: userName});
        });

        list.appendChild(roomItem);
    };

    window.renderPersonal = function(msg, list) {
        let message = document.createElement('p');
        if(msg.me === userName) {
            message.classList.add('fromMe');
        }
        message.innerText = msg.text;
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
            if(tabItem.classList.contains('tab--personal')) {
                tabsContent[i].classList.add('active');
                tabItem.style.display = 'block';
                tabItem.querySelector('.personal-chat-name').innerHTML = friendName.textContent;
                if(friendName.classList.contains('online')) tabItem.querySelector('.personal-chat-name').classList.add('online');
                tabItem.querySelector('.personal-chat-icon').src = friendIcon;
                tabItem.classList.add('active');
            }
        });

        window.changeTemplateMessage();

        socket.emit('friendMessages', {me: userName, name: friendName.textContent});
    }

};