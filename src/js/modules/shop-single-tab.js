export default function shopSingleTab() {
  const tabLinks = document.querySelectorAll('.description__tab-link');
  const tabContents = document.querySelectorAll('.description__tab-content');
  let activeTabIndex = 0;

  showContentOfTheActiveTab();

  tabLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      for (let i = 0; i < tabLinks.length; i++) {
        if (link === tabLinks[i]) {
          link.classList.add('description__tab-link_active');
        } else {
          tabLinks[i].classList.remove('description__tab-link_active');
        }
      }

      activeTabIndex = index;
      showContentOfTheActiveTab();
    });
  });

  function showContentOfTheActiveTab() {
    for (let i = 0; i < tabContents.length; i++) {
      if (i === activeTabIndex) {
        tabContents[i].classList.add('description__tab-content_shown');
      } else {
        tabContents[i].classList.remove('description__tab-content_shown');
      }
    }
  }
}
