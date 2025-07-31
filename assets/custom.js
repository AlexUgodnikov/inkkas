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



function rebayBundlesCustomVarinats(){
 

  const rebauyProductsCardsVariants = () => {

    const rebauyProductsCards = document.querySelectorAll('.rebuy-product-block[aria-label="product"]');

     if(rebauyProductsCards.length == 0) return

      rebauyProductsCards.forEach((card) => {
   

        const getCardOptions = card.querySelector('.rebuy-product-options select');

        if (getCardOptions) {
          const optionsCollection = Array.from(getCardOptions.options);
          if (optionsCollection.length > 1) {
            const menOptions = [];
            const womenOptions = [];
            const eurOptions = [];

            optionsCollection.forEach(option => {
              const parts = option.text.toLowerCase().split(' / ');
              const men = parts.find(p => p.includes('men'))?.trim();
              const women = parts.find(p => p.includes('women'))?.trim();
              const eur = parts.find(p => p.includes('eur'))?.trim();

              if (men) menOptions.push({ label: men.replace('us men', '').trim(), value: option.value });
              if (women) womenOptions.push({ label: women.replace('us women', '').trim(), value: option.value });
              if (eur) eurOptions.push({ label: eur.replace('eur', '').trim(), value: option.value });
            });

            function createRadioGroup(namePrefix, optionsArray) {
              const container = document.createElement('div');
              container.classList.add('radio-group');
              container.dataset.group = namePrefix;

              optionsArray.forEach((opt, index) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `${getCardOptions.id}-${namePrefix}`;
                input.id = `${getCardOptions.id}-${namePrefix}-${index}`;
                input.value = opt.value;
                input.className = 'rebuy-product-option-radio';

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.textContent = opt.label;

                container.appendChild(input);
                container.appendChild(label);
              });

              return container;
            }

            const wrapper = document.createElement('div');
            wrapper.classList.add('custom-option-wrapper');

            const tabContainer = document.createElement('div');
            tabContainer.className = 'tab-buttons';

            ['men', 'women', 'eur'].forEach((tabName, index) => {
              const btn = document.createElement('button');
              btn.textContent = tabName.toUpperCase();
              btn.dataset.target = tabName;
              btn.className = 'tab-button';
              if (index === 0) btn.classList.add('active');

              btn.addEventListener('click', () => {
                tabContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                wrapper.querySelectorAll('.radio-group').forEach(group => {
                  group.style.display = group.dataset.group === tabName ? 'flex' : 'none';
                });
              });

              tabContainer.appendChild(btn);
            });

            const groupsFragment = document.createDocumentFragment();
            groupsFragment.appendChild(createRadioGroup('men', menOptions));
            groupsFragment.appendChild(createRadioGroup('women', womenOptions));
            groupsFragment.appendChild(createRadioGroup('eur', eurOptions));

            groupsFragment.querySelectorAll('.radio-group').forEach(group => {
              if (group.dataset.group !== 'men') group.style.display = 'none';
            });

            wrapper.appendChild(tabContainer);
            wrapper.appendChild(groupsFragment);
            getCardOptions.parentNode.prepend(wrapper);


            function changeCustomRadioButtons(){
              const getCustomRadio = document.querySelectorAll('.rebuy-product-option-radio');
              if(getCustomRadio){
                getCustomRadio.forEach((radio) => {
                  radio.addEventListener('change', (e) => {
                  

                      const select = e.target.parentNode.closest('.rebuy-product-options')
                      .querySelector('.rebuy-select');

                      if (select) {

                        select.value = e.target.value;


                        const changeEvent = new Event('change', { bubbles: true });
                        select.dispatchEvent(changeEvent);
                      }

                      
                  
                  });
                });
              }
            }changeCustomRadioButtons()

          }
        }


      
      })

  }


  const observer = new MutationObserver((mutations, observerInstance) => {
  const targetElement = document.querySelector('.rebuy-bundle-builder__main .rebuy-product-options');
      
      if (targetElement) {
        observerInstance.disconnect(); 
        setTimeout(() => {
          rebauyProductsCardsVariants()
        }, 2000)
        
      }
    });

   
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

}
rebayBundlesCustomVarinats()