(function() {
    'use strict';

    const homeBlocks = document.querySelector('.home-blocks');
    const homeBlocksSearch = document.querySelector('.home-blocks__search');
    const userRoom = document.querySelector('.user-room');
    const userRoomList = userRoom.querySelector('.user-room-list');

    window.changeTemplate = function(search) {
        if (search) {
            homeBlocks.style.display = 'none';
            homeBlocksSearch.style.display = 'flex';
            userRoom.style.display = 'block';
        } else {
            return;
        }
    };
})();