window.searchGame = (userName, games, hostIcon, userID) => {
    const socket = io('http://localhost:3000'); // http://localhost:3000

    const roomsList = document.querySelector('.rooms-list');
    const room = document.querySelector('.room');

    let searchTeamBtn = document.querySelector('.search-team');
    let startSearchBtn = document.querySelector('.start-searching');

    let filters = document.querySelectorAll('.checkbox-filter');
    let gamesItems = document.querySelectorAll('.games-list li');
    let checked = ['all-games'];
    let choosenGames = [];
    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            choosenGames = [];
            let checkedGames = [];
            let checkbox = '';
            if(!filter.classList.contains('tab')) {
                checkbox = filter.querySelector('input');
            } else {
                checkbox = { id: filter.id };
                filters.forEach((fil) => {
                    if(fil.classList.contains('tab')) fil.classList.remove('active')
                });
                filter.classList.add('active');
            }
            gamesItems.forEach((gameItem) => gameItem.style.display = 'none');
            if (checkbox.checked || filter.classList.contains('active')) checked.push(checkbox.id);
            checked = checked.filter((item, pos) => checked.indexOf(item) === pos);
            let filtersInputs = document.querySelectorAll('.checkbox-filter input');
            checked.forEach((check, i) => {
                let checkedBool = true;
                filtersInputs.forEach((input) => {
                    if (check === input.id && input.checked || check === 'all-games' || check === 'favorite-games') {
                        let count = 0;
                        checked.forEach((che) => {
                            if(che === 'all-games' || che === 'favorite-games') count++
                        });
                        if(count !== 2) {
                            checkedBool = false;
                        }
                    }
                });
                if (checkedBool) checked.splice(i, 1);
            });
            checked.forEach((check) => {
                games.forEach((game) => {
                    let similars = 0;
                    if (game.genres) game.genres.forEach((genre) => {
                        if (genre.description === check) similars++;
                    });
                    if(similars === checked.length - 1) checkedGames.push(game)
                });
            });
            checkedGames = checkedGames.filter((item, pos) => checkedGames.indexOf(item) === pos);
            if (checkedGames.length === 0) {
                gamesItems.forEach((item, i) => {
                    item.style.display = 'flex';
                    choosenGames.push(games[i]);
                });
            } else {
                gamesItems.forEach((gameItem, i) => {
                    checkedGames.forEach((checkedGame) => {
                        if (gameItem.querySelector('p').innerText === checkedGame.name) {
                            gameItem.style.display = 'flex';
                            choosenGames.push(games[i]);
                        }
                    })
                })
            }
        })
    });

    let gameCheckboxes = document.querySelectorAll('.games-list li input');
    gameCheckboxes.forEach((gameItem, i) => {
        gameItem.addEventListener('click', () => {
            choosenGames.push(games[i]);

            choosenGames = choosenGames.filter((item, pos) => choosenGames.indexOf(item).name === pos.name);

            let checkedCheckboxes = [];
            gameCheckboxes.forEach((check, e) => {
                if(check.checked) checkedCheckboxes.push(e)
            });

            choosenGames.forEach((check, i) => {
                let checkedBool = true;
                checkedCheckboxes.forEach((id) => {
                    if (check.name === gamesItems[id].querySelector('p').innerText) {
                        checkedBool = false;
                    }
                });
                if (checkedBool) choosenGames.splice(i, 1);
            });
        });
    });

    startSearchBtn.addEventListener('click', () => {
        socket.connect();
        if(choosenGames.length === 0) choosenGames = games;
        let gamesID = [];
        choosenGames.forEach((chose) => {
            gamesID.push(chose.gameID)
        });

        socket.emit('createRoom', {roomTitle: 'My room', hostName: userName, hostIcon, games: gamesID}, () => console.log('error'));

        socket.on('rooms', (data) => {
            console.log(data);
            roomsList.innerHTML = '';
            let rooms = data.rooms;
            rooms.forEach((room, i, arr) => {
                let similarity = false;
                room.games.forEach((gameID) => {
                    gamesID.forEach((roomGameID) => {
                        if(gameID === roomGameID) similarity = true;
                    })
                });
                if(!similarity) arr.splice(i, 1)
            });
            rooms.forEach((room) => {
                let myRoom = false;
                room.users.forEach((user) => {
                   if(user.name === userName) myRoom = true;
                });
                if(myRoom || data.anotherRoom) {
                    document.querySelector('.tab--room').id = room.roomID;
                    window.changeTemplate(true, room);
                }
                else {
                    window.renderRoom(room.host.name, roomsList, room.roomID);
                }
            });
        });

        document.querySelectorAll('.chat-tabs .tab').forEach((tab) => {
           if(tab.classList.contains('active') && !tab.classList.contains('tab--room')) tab.classList.remove('active');
           if(tab.classList.contains('tab--room')) {
               tab.classList.add('active');
               tab.style.display = 'block';
           }
        });

        document.querySelectorAll('.chat-content .messages').forEach((messagesBlock) => {
            if(messagesBlock.classList.contains('active') && !messagesBlock.classList.contains('messages--room')) messagesBlock.classList.remove('active');
            if(messagesBlock.classList.contains('messages--room')) messagesBlock.classList.add('active');
        });

        startSearchBtn.innerHTML = 'Идет поиск...';
        startSearchBtn.disabled = true;
    });


    window.stopSearching = () => {
        if(room.style.display === 'flex') {
            // socket.disconnect();
            // user = changeRoom('', socket.id, 'world');
            socket.emit('changeRoom', {user: userName, room: 'world'});
            document.querySelectorAll('.chat-tabs .tab').forEach((tab) => {
                if(tab.classList.contains('active')) {
                    tab.classList.remove('active');
                    tab.style.display = 'none';
                }
                if(tab.classList.contains('tab--world')) {
                    tab.classList.add('active');
                    tab.style.display = 'block';
                }
            });

            document.querySelectorAll('.chat-content .messages').forEach((messagesBlock) => {
                if(messagesBlock.classList.contains('active')) messagesBlock.classList.remove('active');
                if(messagesBlock.classList.contains('messages--world')) messagesBlock.classList.add('active');
            });

            startSearchBtn.innerHTML = 'Найти команду!';
            startSearchBtn.disabled = false;
        }
    }
};
