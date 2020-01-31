(() => {

    'use strict';

    const mainLogo = document.querySelector('.page-header--logo');

    mainLogo.addEventListener('click', (evt) => {
        evt.preventDefault();

        window.changeTemplateToStart();
    })

})();