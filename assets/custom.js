const observer = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      const quantityBreaksWrapper = addedNodes.find(node => node.classList && node.classList.contains('quantity-breaks-now-wrapper'));
      console.log(addedNodes);
      if (quantityBreaksWrapper && quantityBreaksWrapper.childElementCount !== 0) {
        // .quantity-breaks-now-wrapper and not empty
      }
    }
  }
});
const config = { childList: true, subtree: true };
observer.observe(document, config);