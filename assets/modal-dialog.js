/**
 *  @class
 *  @function ModalDialog
 */
if (!customElements.get('modal-dialog')) {
  class ModalDialog extends HTMLElement {
    constructor() {
      super();
      this.querySelector('[id^="ModalClose-"]').addEventListener(
        'click',
        this.hide.bind(this)
      );
      this.addEventListener('keyup', (event) => {
        if (event.code.toUpperCase() === 'ESCAPE') {
          this.hide();
        }
      });
      if (this.classList.contains('media-modal')) {
        this.addEventListener('pointerup', (event) => {
          if (event.pointerType === 'mouse' && !event.target.closest('product-model')) this.hide();
        });
      } else {
        this.addEventListener('click', (event) => {
          if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
        });
      }
    }

    connectedCallback() {
      if (this.moved) return;
      this.moved = true;
      document.body.appendChild(this);





     /* const observer = new MutationObserver(function(mutations) {

              let isInitialized = false;

              mutations.forEach(function(mutation) {
                  if (mutation.addedNodes.length && !isInitialized) { 

                      //your element what you want found
                      const domElement = document.querySelectorAll('preorder-me-button');

                  
                      if (domElement.length > 0) {
                            const targetContainer = document.querySelector('.product-add-to-cart-container .add_to_cart_holder');
                                            
                            //your custom scripts
                            
                            targetContainer.appendChild(domElement[0]);
                        
                          if(domElement[0].querySelector('button').style.display === 'none'){
                            // domElement[0].style.display = 'none';
                            }
                            //domElement[0].style.flex = 1
                        //domElement[0].style.width = '83%';

                          //END your custom scripts



                          isInitialized = true; 
                          
                          observer.disconnect();
                      }
                  }
              });
          });

          observer.observe(document.body, { childList: true, subtree: true });*/




    }

    show(opener) {
      this.openedBy = opener;
      document.body.classList.add('overflow-hidden');
      this.setAttribute('open', '');
    }

    hide() {
      document.body.classList.remove('overflow-hidden');
      this.removeAttribute('open');
      this.querySelectorAll('.js-youtube').forEach((video) => {
        video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
      this.querySelectorAll('.js-vimeo').forEach((video) => {
        video.contentWindow.postMessage('{"method":"pause"}', '*');
      });
      this.querySelectorAll('video').forEach((video) => video.pause());
    }
  }
  customElements.define('modal-dialog', ModalDialog);
}
if (!customElements.get('modal-opener')) {
  class ModalOpener extends HTMLElement {
    constructor() {
      super();

      const button = this.querySelector('button');

      if (!button) return;
      button.addEventListener('click', () => {

        const modal = document.querySelector(this.getAttribute('data-modal'));
        if (modal) modal.show(button);
      });
    }
  }
  customElements.define('modal-opener', ModalOpener);
}





