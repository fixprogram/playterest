(function() {
    'use strict';

    window.parseData = function(data) {
        data = data.replace(/&quot;/g, '"');
        data = data.replace(/&amp;/g, '&');
        data = data.replace(/&#x27;/g, "'");
        return JSON.parse(data);
    };

    window.tabulation = function(tabs, tabsContent) {
        tabs.forEach((tab, i) => tab.addEventListener('click', function() {
            tabs.forEach((tabItem) => {
                if (tabItem.classList.contains('active'))  tabItem.classList.remove('active')
            });
            tabsContent.forEach((tabContent) => {
                if (tabContent.classList.contains('active'))  tabContent.classList.remove('active')
            });
            this.classList.add('active');
            tabsContent[i].classList.add('active');
        }));
    };

})();