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
                userName.innerHTML = user;
                if(user === roomData.hostName) {
                    userName.innerHTML = user + ' <span style="color:#DCDEDF;margin-left:7px;">Создатель</span>';
                    let hostIcon = document.createElement('img');
                    hostIcon.src = roomData.hostIcon;
                    userItem.appendChild(hostIcon);
                }
                userItem.appendChild(userName);
                roomUsers.appendChild(userItem);
            });
            // let userItem = document.createElement('li');
            // let hostIcon = document.createElement('img');
            // hostIcon.src = roomData.hostIcon;
            // let hostName = document.createElement('p');
            // hostName.innerHTML = roomData.hostName;
            // userItem.appendChild(hostIcon);
            // userItem.appendChild(hostName);
            // roomUsers.appendChild(userItem);
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