export default function mobileNavigation() {
  const navigation = document.querySelector('.header__navigation');
  const navigationMobileOpener = document.querySelector(
    '.header__navigation-mobile-opener'
  );
  const naviagtionDropdowns = document.querySelectorAll(
    '.header__navigation-dropdown'
  );

  navigationMobileOpener.addEventListener('click', () => {
    navigation.classList.toggle('header__navigation_mobile-opened');

    const isNavigationOpened = navigation.classList.contains(
      'header__navigation_mobile-opened'
    );
    document.body.style.height = isNavigationOpened ? '100%' : 'auto';
    document.body.style.overflow = isNavigationOpened ? 'hidden' : 'auto';

    navigationMobileOpener.classList.toggle(
      'header__navigation-mobile-opener_close-mod'
    );

    const isNavigationClosed = !navigation.classList.contains(
      'header__navigation_mobile-opened'
    );

    if (isNavigationClosed) {
      naviagtionDropdowns.forEach((dropdown) => {
        const showContentBtnIcon = dropdown.querySelector(
          '.header__navigation-dropdown-btn-icon'
        );
        const content = dropdown.querySelector(
          '.header__navigation-dropdown-content'
        );

        const isNavigationDropdownContentShown = content.classList.contains(
          'header__navigation-dropdown-content_shown'
        );

        if (isNavigationDropdownContentShown) {
          showContentBtnIcon.classList.remove(
            'header__navigation-dropdown-btn-icon_active'
          );
          content.classList.remove('header__navigation-dropdown-content_shown');
          content.style.maxHeight = null;
        }
      });
    }
  });
}
