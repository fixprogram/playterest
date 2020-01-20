
function renderGame(game, list, icon) {
    let item = document.createElement('li');
    let gameName = document.createElement('p');
    if(icon) {
        let gameIcon = document.createElement('img');
        gameIcon.src = icon;
        item.appendChild(gameIcon);
    }
    gameName.innerText = game;
    item.appendChild(gameName);
    list.appendChild(item);
}