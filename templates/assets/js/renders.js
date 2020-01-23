window.renders = function(userName) {

    const socket = io('http://localhost:3000'); // http://localhost:3000

    window.renderGame = function(game, list, icon) {
        let gameItem = document.createElement('li');
        let gameName = document.createElement('p');
        if(icon) {
            let gameIcon = document.createElement('img');
            gameIcon.src = icon;
            gameItem.appendChild(gameIcon);
        }
        gameName.innerText = game;
        gameItem.appendChild(gameName);
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
        buttonMessages.innerHTML = '<svg class="icon icon--ls" width="12" height="12"><use xlink:href="ls-icon"></use></svg>';
        friendName.innerText = name;
        friendItem.appendChild(friendName);
        friendItem.appendChild(buttonMessages);
        list.appendChild(friendItem);

        buttonMessages.addEventListener('click', () => {
            openFriendMessages(buttonMessages);
        });
    };

    window.renderNotice = function() {

    };

    window.renderRoom = function() {

    };

    function openFriendMessages(buttonMessages) {
        let parent = buttonMessages.parentElement;

        window.changeTemplateMessage();

        // 'Не дублировать код, а просто смотреть на содержание таба и взависимости от этого действовать'

        socket.emit('friendMessages', {me: userName, name: parent.querySelector('p').textContent});

    }

};