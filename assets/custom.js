const observer = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      const quantityBreaksWrapper = addedNodes.find(node => node.classList && node.classList.contains('fancybox-container'));

      if (quantityBreaksWrapper && quantityBreaksWrapper.childElementCount !== 0) {
        document.querySelectorAll('.fancybox-custom-link').forEach(function(link) {
          link.addEventListener('click', function() {
            var url = this.getAttribute('href');
            if (url) {
              window.location.href = url;
            }
          });
        });
      }
    }
  }
});
const config = { childList: true, subtree: true };
observer.observe(document, config);