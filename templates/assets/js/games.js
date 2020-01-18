
function renderGame(game, list, icon) {
    let item = document.createElement('li');
    let gameName = document.createElement('p');
    let gameIcon = document.createElement('img');
    gameIcon.src = icon;
    gameName.innerText = game;
    item.appendChild(gameIcon);
    item.appendChild(gameName);
    list.appendChild(item);
}