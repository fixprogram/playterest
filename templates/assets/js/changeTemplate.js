(function () {
    'use strict';

    const socket = io('http://localhost:3000'); // http://localhost:3000
    const homeBlocks = document.querySelector('.home-blocks');
    const room = document.querySelector('.room');
    const roomUsers = document.querySelector('.user-room__list');
    const chat = document.querySelector('.home-chat');
    const personalChat = document.querySelector('.personal-chat');
    const personalChatClose = document.querySelector('.close-chat-btn');
    const personalDialogues = document.querySelector('.all-dialogs');
    const dialogues = document.querySelector('.dialogues');
    const dialoguesList = document.querySelector('.dialogues-list');

    window.changeTemplate = (search, roomData) => {
        roomUsers.innerHTML = '';
        if (search) {
            homeBlocks.style.display = 'none';
            personalChat.style.display = 'none';
            dialogues.style.display = 'none';

            room.style.display = 'flex';
            chat.style.display = 'block';

            if(roomData.users.length === 1) {
                room.querySelector('.user-room__header p').innerHTML = roomData.roomTitle + '<span>' + roomData.users.length + ' участник</span>';
            } else if(roomData.users.length === 5) {
                room.querySelector('.user-room__header p').innerHTML = roomData.roomTitle + '<span>' + roomData.users.length + ' участников</span>';
            } else {
                room.querySelector('.user-room__header p').innerHTML = roomData.roomTitle + '<span>' + roomData.users.length + ' участника</span>';
            }
            roomData.users.forEach((user) => {
                let userItem = document.createElement('li');
                let userName = document.createElement('p');
                userName.innerHTML = user.name;
                if(user.name === roomData.host.name) {
                    userName.innerHTML = user.name + ' <span style="color:#DCDEDF;margin-left:7px;">Создатель</span>';
                }
                let userIcon = document.createElement('img');
                userIcon.src = user.icon;
                userItem.appendChild(userIcon);
                userItem.appendChild(userName);
                roomUsers.appendChild(userItem);
            });
        } else {
            return;
        }
    };

    window.changeTemplateMessage = () => {
        homeBlocks.style.display = 'none';
        room.style.display = 'none';
        chat.style.display = 'none';
        dialogues.style.display = 'none';

        personalChat.style.display = 'block';

        personalChatClose.addEventListener('click', () => {
            window.changeTemplateToStart();
        });

        personalDialogues.addEventListener('click', () => {
           window.changeTemplateMessages();
        });
    };

    window.changeTemplateMessages = () => {
        homeBlocks.style.display = 'none';
        personalChat.style.display = 'none';
        room.style.display = 'none';
        chat.style.display = 'none';

        dialogues.style.display = 'block';

        socket.emit('askForDialogues', document.querySelector('.profile-block p').textContent);

        socket.on('getDialogues', (data) => {
            console.log(data);
            dialoguesList.innerHTML = '';
            data.friendsData.forEach((dataItem) => {
               if(dataItem.messages.length > 1) window.renderDialog(dataItem, dialoguesList)
            });
        })
    };

    window.changeTemplateToStart = () => {
        window.stopSearching();

        room.style.display = 'none';
        personalChat.style.display = 'none';
        dialogues.style.display = 'none';

        homeBlocks.style.display = 'flex';
        chat.style.display = 'flex';

        document.querySelectorAll('.home-chat .chat-tabs .tab').forEach((tab) => {
            if(tab.classList.contains('active')) {
                tab.classList.remove('active');
                tab.style.display = 'none';
            }
            if(tab.classList.contains('tab--world')) {
                tab.classList.add('active');
                tab.style.display = 'block';
            }
        });

        document.querySelectorAll('.home-chat .chat-content .messages').forEach((messagesBlock) => {
            if(messagesBlock.classList.contains('active')) messagesBlock.classList.remove('active');
            if(messagesBlock.classList.contains('messages--world')) messagesBlock.classList.add('active');
        });

    }
})();