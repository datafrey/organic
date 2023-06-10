export default function aboutTeamSocialFix() {
  const teamItemSocialList = document.querySelectorAll('.team__item-social');

  for (const teamItemSocial of teamItemSocialList) {
    const teamItem = teamItemSocial.querySelector('.team__item');
    teamItemSocial.removeChild(teamItem);
  }

  const teamItemsList = document.querySelectorAll('.team__item');

  for (let i = 0; i < teamItemsList.length; i++) {
    teamItemsList[i].appendChild(teamItemSocialList[i]);
  }
}
