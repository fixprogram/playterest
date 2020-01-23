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
            buttonMessages.disabled = true;
        });
    };

    window.renderNotice = function() {

    };

    window.renderRoom = function() {

    };

    window.renderPersonal = function(msg, list) {
        let message = document.createElement('p');
        if(msg.me === userName) {
            message.style.marginLeft = 'auto';
        }
        message.innerText = msg.text;
        list.appendChild(message);
    };

    function openFriendMessages(buttonMessages) {
        let parent = buttonMessages.parentElement;
        let friendName = parent.querySelector('p').textContent;

        let tabs = document.querySelectorAll('.chat-tabs .tab');
        let tabsContent = document.querySelectorAll('.chat-content .messages');
        tabs.forEach((tab) => tab.classList.remove('active'));
        tabsContent.forEach((content) => content.classList.remove('active'));
        tabs.forEach((tabItem, i) => {
            if(tabItem.classList.contains('tab--personal')) {
                tabsContent[i].classList.add('active');
                tabItem.style.display = 'block';
                tabItem.innerHTML = friendName;
                tabItem.classList.add('active');
            }
        });

        window.changeTemplateMessage();

        socket.emit('friendMessages', {me: userName, name: friendName});
    }

};