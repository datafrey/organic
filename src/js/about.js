import aboutTeamSocialFix from './modules/about-team-social-fix.js';
import * as flsFunctions from './modules/functions.js';
import headerNavigationDropdown from './modules/header-navigation-dropdown.js';
import mobileNavigation from './modules/mobile-navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  flsFunctions.isWebp();

  headerNavigationDropdown();
  mobileNavigation();
  aboutTeamSocialFix();
});
