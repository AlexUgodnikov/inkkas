const observer = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      const quantityBreaksWrapper = addedNodes.find(node => node.classList && node.classList.contains('fancybox-container'));

      if (quantityBreaksWrapper && quantityBreaksWrapper.childElementCount !== 0) {
        console.log(123);
      }
    }
  }
});
const config = { childList: true, subtree: true };
observer.observe(document, config);