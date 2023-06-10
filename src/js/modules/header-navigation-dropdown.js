export default function headerNavigationDropdown() {
  const navigationDropdowns = document.querySelectorAll(
    '.header__navigation-dropdown'
  );

  navigationDropdowns.forEach((dropdown) => {
    const showContentBtn = dropdown.querySelector(
      '.header__navigation-dropdown-btn'
    );
    const showContentBtnIcon = showContentBtn.querySelector(
      '.header__navigation-dropdown-btn-icon'
    );
    const content = dropdown.querySelector(
      '.header__navigation-dropdown-content'
    );

    if (screen.width > 767) {
      dropdown.addEventListener('mouseenter', showDropdownDesktop);
      dropdown.addEventListener('mouseleave', hideDropdownDesktop);
    } else {
      showContentBtn.addEventListener('click', toggleDropdownMobile);
    }

    window.addEventListener(
      'resize',
      () => {
        if (screen.width > 767) {
          dropdown.addEventListener('mouseenter', showDropdownDesktop);
          dropdown.addEventListener('mouseleave', hideDropdownDesktop);
          showContentBtn.removeEventListener('click', toggleDropdownMobile);
        } else {
          showContentBtn.addEventListener('click', toggleDropdownMobile);
          dropdown.removeEventListener('mouseenter', showDropdownDesktop);
          dropdown.removeEventListener('mouseleave', hideDropdownDesktop);
        }
      },
      true
    );

    function showDropdownDesktop() {
      content.classList.add('header__navigation-dropdown-content_shown');
      showContentBtnIcon.classList.add(
        'header__navigation-dropdown-btn-icon_active'
      );
    }

    function hideDropdownDesktop() {
      content.classList.remove('header__navigation-dropdown-content_shown');
      showContentBtnIcon.classList.remove(
        'header__navigation-dropdown-btn-icon_active'
      );
    }

    function toggleDropdownMobile() {
      content.classList.toggle('header__navigation-dropdown-content_shown');
      showContentBtnIcon.classList.toggle(
        'header__navigation-dropdown-btn-icon_active'
      );

      navigationDropdowns.forEach((ddropdown) => {
        if (dropdown !== ddropdown) {
          const sshowContentBtnIcon = ddropdown.querySelector(
            '.header__navigation-dropdown-btn-icon'
          );
          const ccontent = ddropdown.querySelector(
            '.header__navigation-dropdown-content'
          );

          sshowContentBtnIcon.classList.remove(
            'header__navigation-dropdown-btn-icon_active'
          );
          ccontent.classList.remove(
            'header__navigation-dropdown-content_shown'
          );

          ccontent.style.maxHeight = null;
        }
      });

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 20 + 'px';
      }
    }
  });
}
