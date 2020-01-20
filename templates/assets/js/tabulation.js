function tabulation(tabs, tabsContent) {
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
}