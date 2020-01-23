(function () {
    'use strict';

    const homeBlocks = document.querySelector('.home-blocks');
    const homeBlocksSearch = document.querySelector('.home-blocks__search');
    const userRoom = document.querySelector('.user-room');
    const userRoomList = userRoom.querySelector('.user-room-list');
    const chat = document.querySelector('.home-chat');

    window.changeTemplate = function (search) {
        if (search) {
            homeBlocks.style.display = 'none';
            homeBlocksSearch.style.display = 'flex';
            userRoom.style.display = 'block';
        } else {
            return;
        }
    };

    window.changeTemplateMessage = function () {
        homeBlocks.style.display = 'none';
        userRoom.style.display = 'none';

        chat.style.height = '100%';
        chat.style.marginTop = '0px';
    }
})();