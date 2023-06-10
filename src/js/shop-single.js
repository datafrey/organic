import * as flsFunctions from './modules/functions.js';
import headerNavigationDropdown from './modules/header-navigation-dropdown.js';
import mobileNavigation from './modules/mobile-navigation.js';
import shopSingleTab from './modules/shop-single-tab.js';

document.addEventListener('DOMContentLoaded', () => {
  flsFunctions.isWebp();

  headerNavigationDropdown();
  mobileNavigation();
  shopSingleTab();
});
