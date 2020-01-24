window.searchGame = function(userName) {
    const socket = io('http://localhost:3000'); // http://localhost:3000

    let searchTeamBtn = document.querySelector('.search-team');
    let filtersBlock = document.querySelector('.filters');
    let startSearchBtn = document.querySelector('.start-searching');

    function getFilters(checkboxes) {
        let checked = [];
        checkboxes.forEach((item) => {
            if (item.checked) checked.push(item.name);
        });
        return checked;
    }

    searchTeamBtn.addEventListener('click', () => filtersBlock.classList.toggle('active'));
    startSearchBtn.addEventListener('click', () => {
        filtersBlock.classList.toggle('active');
        let params = getFilters(filtersBlock.querySelectorAll('input[type="checkbox"]'));
        let link = '/home?params=';
        params.forEach((param) => link += param + ';');

        socket.emit('createRoom', {roomTitle: 'My room', hostName: userName}, () => console.log('error'));

        window.changeTemplate(true);

        startSearchBtn.disabled = true;
    });
};
