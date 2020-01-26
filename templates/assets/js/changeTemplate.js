(function () {
    'use strict';

    const homeBlocks = document.querySelector('.home-blocks');
    const room = document.querySelector('.room');
    const roomUsers = document.querySelector('.user-room__list');
    const chat = document.querySelector('.home-chat');
    const personalChat = document.querySelector('.personal-chat');

    window.changeTemplate = function (search, roomData) {
        if (search) {
            homeBlocks.style.display = 'none';
            personalChat.style.display = 'none';
            room.style.display = 'flex';
            room.querySelector('.user-room__header p').innerHTML = roomData.roomTitle;
            let userItem = document.createElement('li');
            let hostIcon = document.createElement('img');
            hostIcon.src = roomData.hostIcon;
            let hostName = document.createElement('p');
            hostName.innerHTML = roomData.hostName;
            userItem.appendChild(hostIcon);
            userItem.appendChild(hostName);
            roomUsers.appendChild(userItem);
        } else {
            return;
        }
    };

    window.changeTemplateMessage = function () {
        homeBlocks.style.display = 'none';
        room.style.display = 'none';
        chat.style.display = 'none';

        personalChat.style.display = 'block';
    }
})();