/**
 *  @class
 *  @function SocialShare
 */
class SocialShare {
  constructor() {
    this.container = document.querySelector('.share-article');
    this.links = document.querySelectorAll('.social');

    this.setupEventListeners();
  }
  setupEventListeners() {
    this.links.forEach((link) => {
      link.addEventListener('click', (event) => {
        let left = (screen.width / 2) - (640 / 2),
          top = (screen.height / 2) - (440 / 2) - 100;
        window.open(link.getAttribute('href'), 'mywin', 'left=' + left + ',top=' + top + ',width=640,height=440,toolbar=0');
        event.preventDefault();
      });
    });
  }
}
window.addEventListener('load', () => {
  if (typeof SocialShare !== 'undefined') {
    new SocialShare();
  }
});
document.getElementById('shareProductLink').addEventListener('click', function() {
  var currentPageURL = window.location.href;

  var tempInput = document.createElement('input');
  tempInput.setAttribute('value', currentPageURL);
  document.body.appendChild(tempInput);

  tempInput.select();
  document.execCommand('copy');

  document.body.removeChild(tempInput);
});