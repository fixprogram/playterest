(function () {
    'use strict';

    const homeBlocks = document.querySelector('.home-blocks');
    const room = document.querySelector('.room');
    const roomUsers = document.querySelector('.user-room__list');
    const chat = document.querySelector('.home-chat');
    const personalChat = document.querySelector('.personal-chat');

    window.changeTemplate = (search, roomData) => {
        roomUsers.innerHTML = '';
        if (search) {
            homeBlocks.style.display = 'none';
            personalChat.style.display = 'none';
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

        personalChat.style.display = 'block';
    };

    window.changeTemplateToStart = () => {
        room.style.display = 'none';
        personalChat.style.display = 'none';

        homeBlocks.style.display = 'flex';
        chat.style.display = 'flex';
    }
})();