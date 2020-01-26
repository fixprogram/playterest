window.searchGame = function(userName, games, hostIcon) {
    const socket = io('http://localhost:3000'); // http://localhost:3000

    const roomsList = document.querySelector('.rooms-list');

    let searchTeamBtn = document.querySelector('.search-team');
    let startSearchBtn = document.querySelector('.start-searching');

    let filters = document.querySelectorAll('.checkbox-filter');
    let gamesItems = document.querySelectorAll('.games-list li');
    let checked = [];
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
            console.log(checked);
            checked.forEach((check) => {
                games.forEach((game) => {
                    if (game.categories) game.categories.forEach((category) => {
                        if (category.description === check) checkedGames.push(game)
                    })
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
            choosenGames = [];
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

    searchTeamBtn.addEventListener('click', () => filtersBlock.classList.toggle('active'));
    startSearchBtn.addEventListener('click', () => {
        console.log(choosenGames);
        let gamesID = [];
        choosenGames.forEach((chose) => {
            gamesID.push(chose.gameID)
        });

        socket.emit('createRoom', {roomTitle: 'My room', hostName: userName, hostIcon, games: gamesID}, () => console.log('error'));

        socket.on('rooms', (data) => {
            console.log(data);
            data.rooms.forEach((room) => {
                if(room.hostName === userName) {
                    window.changeTemplate(true, room);
                } else {
                    window.renderRoom(room.roomTitle, roomsList);
                }
            });
        });

        startSearchBtn.innerHTML = 'Идет поиск...';
        startSearchBtn.disabled = true;
    });
};
