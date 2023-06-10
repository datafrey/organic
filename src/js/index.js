import * as flsFunctions from './modules/functions.js';
import slider from './modules/slider.js';
import headerNavigationDropdown from './modules/header-navigation-dropdown.js';
import mobileNavigation from './modules/mobile-navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  flsFunctions.isWebp();

  slider('.testimonial__slider');
  headerNavigationDropdown();
  mobileNavigation();
});
