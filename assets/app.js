function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
var dispatchCustomEvent = function dispatchCustomEvent(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var detail = {
    detail: data
  };
  var event = new CustomEvent(eventName, data ? detail : null);
  document.dispatchEvent(event);
};
window.recentlyViewedIds = [];

/**
 *  @class
 *  @function Quantity
 */
if (!customElements.get('quantity-selector')) {
  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('.qty');
      this.step = this.input.getAttribute('step');
      this.changeEvent = new Event('change', {
        bubbles: true
      });
      // Create buttons
      this.subtract = this.querySelector('.minus');
      this.add = this.querySelector('.plus');

      // Add functionality to buttons
      this.subtract.addEventListener('click', () => this.change_quantity(-1 * this.step));
      this.add.addEventListener('click', () => this.change_quantity(1 * this.step));

    }
    connectedCallback() {
      this.classList.add('buttons_added');
      this.validateQtyRules();
    }
    change_quantity(change) {
      // Get current value
      let quantity = Number(this.input.value);

      // Ensure quantity is a valid number
      if (isNaN(quantity)) quantity = 1;

      // Check for min & max
      if (this.input.getAttribute('min') > (quantity + change)) {
        return;
      }
      if (this.input.getAttribute('max')) {
        if (this.input.getAttribute('max') < (quantity + change)) {
          return;
        }
      }
      // Change quantity
      quantity += change;

      // Ensure quantity is always a number
      quantity = Math.max(quantity, 1);

      // Output number
      this.input.value = quantity;

      this.input.dispatchEvent(this.changeEvent);

      this.validateQtyRules();
    }
    validateQtyRules() {
      const value = parseInt(this.input.value);
      if (this.input.min) {
        const min = parseInt(this.input.min);
        this.subtract.classList.toggle('disabled', value <= min);
      }
      if (this.input.max) {
        const max = parseInt(this.input.max);
        this.add.classList.toggle('disabled', value >= max);
      }
    }
  }
  customElements.define('quantity-selector', QuantityInput);
}

/**
 *  @class
 *  @function ArrowSubMenu
 */
class ArrowSubMenu {

  constructor(self) {
    this.submenu = self.parentNode.querySelector('.sub-menu');
    this.arrow = self;
    // Add functionality to buttons
    self.addEventListener('click', (e) => this.toggle_submenu(e));
  }

  toggle_submenu(e) {
    e.preventDefault();
    let submenu = this.submenu;

    if (!submenu.classList.contains('active')) {
      submenu.classList.add('active');

    } else {
      submenu.classList.remove('active');
      this.arrow.blur();
    }
  }
}
let arrows = document.querySelectorAll('.thb-arrow');
arrows.forEach((arrow) => {
  new ArrowSubMenu(arrow);
});

/**
 *  @class
 *  @function ProductCard
 */
if (!customElements.get('product-card')) {
  class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.swatches = this.querySelector('.product-card-swatches');
      this.image = this.querySelector('.product-featured-image-link .product-primary-image');
      this.additional_images = this.querySelectorAll('.product-secondary-image');
      this.additional_images_nav = this.querySelectorAll('.product-secondary-images-nav li');
      this.quick_add = this.querySelector('.product-card--add-to-cart-button-simple');
      this.size_options = this.querySelector('.product-card-sizes');
    }
    connectedCallback() {
      if (this.swatches) {
        this.enableSwatches(this.swatches, this.image);
      }
      if (this.additional_images) {
        this.enableAdditionalImages();
      }
      if (this.quick_add) {
        this.enableQuickAdd();
      }
      if (this.size_options) {
        this.enableSizeOptions();
      }
    }
    enableAdditionalImages() {
      let image_length = this.additional_images.length;
      let images = this.additional_images;
      let nav = this.additional_images_nav;
      let image_container = this.querySelector('.product-featured-image');
      const mousemove = function (e) {
        if (!e.target.parentElement.classList.contains('product-featured-image-link')) {
          return;
        }
        let l = e.offsetX;
        let w = this.getBoundingClientRect().width;
        let prc = l / w;
        let sel = Math.floor(prc * image_length);
        let selimg = images[sel];
        images.forEach((image, index) => {
          if (image.classList.contains('hover')) {
            image.classList.remove('hover');
            if (nav.length) {
              nav[index].classList.remove('active');
            }
          }
        });
        if (selimg) {
          if (!selimg.classList.contains('hover')) {
            selimg.classList.add('hover');
            if (nav.length) {
              nav[sel].classList.add('active');
            }
          }
        }

      };
      const mouseleave = function (e) {
        images.forEach((image, index) => {
          image.classList.remove('hover');
          if (nav.length) {
            nav[index].classList.remove('active');
          }
        });
      };
      if (image_container) {
        image_container.addEventListener('touchstart', mousemove, {
          passive: true
        });
        image_container.addEventListener('touchmove', mousemove, {
          passive: true
        });
        image_container.addEventListener('touchend', mouseleave, {
          passive: true
        });
        image_container.addEventListener('mouseenter', mousemove, {
          passive: true
        });
        image_container.addEventListener('mousemove', mousemove, {
          passive: true
        });
        image_container.addEventListener('mouseleave', mouseleave, {
          passive: true
        });
      }

      images.forEach(function (image) {
        window.addEventListener('load', (event) => {
          lazySizes.loader.unveil(image);
        });
      });

    }
    enableSwatches(swatches, image) {
      let swatch_list = swatches.querySelectorAll('.product-card-swatch'),
        org_srcset = image ? image.dataset.srcset : '';
      this.color_index = this.swatches.dataset.index;

      swatch_list.forEach((swatch, index) => {
        window.addEventListener('load', (event) => {
          let image = new Image();
          image.srcset = swatch.dataset.srcset;
          lazySizes.loader.unveil(image);
        });

        swatch.addEventListener('mouseover', () => {
          [].forEach.call(swatch_list, function (el) {
            el.classList.remove('active');
          });
          if (image) {
            if (swatch.dataset.srcset) {
              image.setAttribute('srcset', swatch.dataset.srcset);
            } else {
              image.setAttribute('srcset', org_srcset);
            }
          }
          if (this.size_options) {
            this.current_options[this.color_index] = swatch.querySelector('span').innerText;
            this.updateMasterId();
          }
          swatch.classList.add('active');
        });
        swatch.addEventListener('click', function (evt) {
          window.location.href = this.dataset.href;
          evt.preventDefault();
        });
      });
    }
    enableQuickAdd() {
      this.quick_add.addEventListener('click', this.quickAdd.bind(this));
    }
    enableSizeOptions() {
      let size_list = this.size_options.querySelectorAll('.product-card-sizes--size'),
        featured_image = this.querySelector('.product-featured-image'),
        has_hover = featured_image.classList.contains('thb-hover'),
        size_parent = this.size_options.parentElement;

      this.size_index = this.size_options.dataset.index;

      this.current_options = this.size_options.dataset.options.split(',');

      this.updateMasterId();

      size_parent.addEventListener('mouseenter', () => {
        if (has_hover) {
          featured_image.classList.remove('thb-hover');
        }
      }, {
        passive: true
      });
      size_parent.addEventListener('mouseleave', () => {
        if (has_hover) {
          featured_image.classList.add('thb-hover');
        }
      }, {
        passive: true
      });
      size_list.forEach((size) => {
        size.addEventListener('click', (evt) => {
          evt.preventDefault();

          if (size.classList.contains('is-disabled')) {
            return;
          }
          this.current_options[this.size_index] = size.querySelector('span').innerText;
          this.updateMasterId();

          size.classList.add('loading');
          size.setAttribute('aria-disabled', true);
          const config = {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/javascript'
            }
          };
          let formData = new FormData();

          formData.append('id', this.currentVariant.id);
          formData.append('quantity', 1);
          formData.append('sections', this.getSectionsToRender().map((section) => section.section));
          formData.append('sections_url', window.location.pathname);

          config.body = formData;

          fetch(`${theme.routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                return;
              }
              this.renderContents(response);

              dispatchCustomEvent('cart:item-added', {
                product: response.hasOwnProperty('items') ? response.items[0] : response
              });
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              size.classList.remove('loading');
              size.removeAttribute('aria-disabled');
            });
        });
      });
    }
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.current_options[index] === option;
        }).includes(false);
      });
      setTimeout(() => {
        this.setDisabled();
      }, 100);
    }
    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
    setDisabled() {
      const variant_data = this.getVariantData();

      if (variant_data) {

        if (this.currentVariant) {
          const selected_options = this.currentVariant.options.map((value, index) => {
            return {
              value,
              index: `option${index + 1}`
            };
          });

          const available_options = this.createAvailableOptionsTree(variant_data, selected_options);

          const fieldset_options = Object.values(available_options)[this.size_index];
          if (fieldset_options) {
            if (this.size_options.querySelectorAll('.product-card-sizes--size').length) {
              this.size_options.querySelectorAll('.product-card-sizes--size').forEach((input, input_i) => {
                input.classList.toggle('is-disabled', fieldset_options[input_i].isUnavailable);
              });
            }
          }
        } else {
          if (this.size_options.querySelectorAll('.product-card-sizes--size').length) {
            this.size_options.querySelectorAll('.product-card-sizes--size').forEach((input, input_i) => {
              input.classList.add('is-disabled');
            });
          }
        }

      }
      return true;
    }
    createAvailableOptionsTree(variant_data, selected_options) {
      // Reduce variant array into option availability tree
      return variant_data.reduce((options, variant) => {

        // Check each option group (e.g. option1, option2, option3) of the variant
        Object.keys(options).forEach(index => {

          if (variant[index] === null) return;

          let entry = options[index].find(option => option.value === variant[index]);

          if (typeof entry === 'undefined') {
            // If option has yet to be added to the options tree, add it
            entry = {
              value: variant[index],
              isUnavailable: true
            };
            options[index].push(entry);
          }

          // Check how many selected option values match a variant
          const countVariantOptionsThatMatchCurrent = selected_options.reduce((count, {
            value,
            index
          }) => {
            return variant[index] === value ? count + 1 : count;
          }, 0);

          // Only enable an option if an available variant matches all but one current selected value
          if (countVariantOptionsThatMatchCurrent >= selected_options.length - 1) {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }

          // Make sure if a variant is unavailable, disable currently selected option
          if ((!this.currentVariant || !this.currentVariant.available) && selected_options.find((option) => option.value === entry.value && index === option.index)) {
            entry.isUnavailable = true;
          }

          // First option is always enabled
          if (index === 'option1') {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }
        });

        return options;
      }, {
        option1: [],
        option2: [],
        option3: []
      });
    }
    quickAdd(evt) {
      evt.preventDefault();
      if (this.quick_add.disabled) {
        return;
      }
      this.quick_add.classList.add('loading');
      this.quick_add.setAttribute('aria-disabled', true);

      const config = {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript'
        }
      };

      let formData = new FormData();

      formData.append('id', this.quick_add.dataset.productId);
      formData.append('quantity', 1);
      formData.append('sections', this.getSectionsToRender().map((section) => section.section));
      formData.append('sections_url', window.location.pathname);

      config.body = formData;

      fetch(`${theme.routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            return;
          }
          this.renderContents(response);

          dispatchCustomEvent('cart:item-added', {
            product: response.hasOwnProperty('items') ? response.items[0] : response
          });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.quick_add.classList.remove('loading');
          this.quick_add.removeAttribute('aria-disabled');
        });

      return false;
    }
    getSectionsToRender() {
      return [{
        id: 'Cart',
        section: 'main-cart',
        selector: '.thb-cart-form'
      },
      {
        id: 'Cart-Drawer',
        section: 'cart-drawer',
        selector: '.cart-drawer'
      },
      {
        id: 'cart-drawer-toggle',
        section: 'cart-bubble',
        selector: '.thb-item-count'
      }];
    }
    renderContents(parsedState) {
      this.getSectionsToRender().forEach((section => {
        if (!document.getElementById(section.id)) {
          return;
        }
        const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        if (typeof CartDrawer !== 'undefined') {
          new CartDrawer();
        }
        if (typeof Cart !== 'undefined') {
          new Cart().renderContents(parsedState);
        }
      }));


      if (document.getElementById('Cart-Drawer')) {
        document.getElementById('Cart-Drawer').classList.add('active');
        document.body.classList.add('open-cart');
        document.body.classList.add('open-cc');
        if (document.getElementById('Cart-Drawer').querySelector('.product-recommendations--full')) {
          document.getElementById('Cart-Drawer').querySelector('.product-recommendations--full').classList.add('active');
        }
        dispatchCustomEvent('cart-drawer:open');
      }
    }
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  }
  customElements.define('product-card', ProductCard);
}
/**
 *  @class
 *  @function Header
 */
class Header {
  constructor() {
    const header = document.querySelector('.header-section'),
      header_main = document.getElementById('header'),
      menu = document.getElementById('mobile-menu'),
      toggle = document.querySelector('.mobile-toggle-wrapper'),
      setHeaderOffset = this.setHeaderOffset,
      setAnnouncementHeight = this.setAnnouncementHeight,
      setHeaderHeight = this.setHeaderHeight;

    if (!header_main) {
      return;
    }
    document.addEventListener('keyup', (e) => {
      if (e.code) {
        if (e.code.toUpperCase() === 'ESCAPE') {
          toggle.removeAttribute('open');
          toggle.classList.remove('active');
          header_main.classList.remove('mobile-menu-active');
        }
      }
    });
    toggle.querySelector('.mobile-toggle').addEventListener('click', (e) => {
      setAnnouncementHeight(header);
      if (toggle.classList.contains('active')) {
        e.preventDefault();
        document.body.classList.remove('overflow-hidden');
        toggle.classList.remove('active');
        header_main.classList.remove('mobile-menu-active');
        this.closeAnimation(toggle);

      } else {
        document.body.classList.add('overflow-hidden');
        setTimeout(() => {
          toggle.classList.add('active');
          header_main.classList.add('mobile-menu-active');
        });
      }
      window.dispatchEvent(new Event('resize.resize-select'));
    });

    // Mobile Menu offset
    window.addEventListener('scroll', function () {
      setHeaderOffset(header);
      setHeaderHeight(header_main);
      // Sticky Header Class
      if (header_main.classList.contains('header-sticky--active')) {
        let offset = parseInt(header_main.getBoundingClientRect().top, 10) + document.documentElement.scrollTop;

        header_main.classList.toggle('is-sticky', window.scrollY >= offset && window.scrollY > 0);
      }

    }, {
      passive: true
    });
    window.dispatchEvent(new Event('scroll'));

    if (document.getElementById('shopify-section-announcement-bar')) {
      const a_bar = document.getElementById('shopify-section-announcement-bar');
      window.addEventListener('resize', function () {
        setAnnouncementHeight(a_bar);
      }, {
        passive: true
      });
      window.dispatchEvent(new Event('resize'));
    }
    // Buttons.
    menu.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    menu.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
  }
  setAnnouncementHeight(a_bar) {
    let h = a_bar.clientHeight;
    document.documentElement.style.setProperty('--announcement-height', h + 'px');
  }
  setHeaderOffset(header) {
    let h = header.getBoundingClientRect().top;
    document.documentElement.style.setProperty('--header-offset', h + 'px');
  }
  setHeaderHeight(header) {
    let h = header.clientHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }
  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest('.link-container');
    const isOpen = detailsElement.hasAttribute('open');

    setTimeout(() => {
      detailsElement.classList.add('menu-opening');
      parentMenuElement && parentMenuElement.classList.add('submenu-open');
    }, 100);
  }
  onCloseButtonClick(event) {
    event.preventDefault();
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }
  closeSubmenu(detailsElement) {
    detailsElement.classList.remove('menu-opening');
    this.closeAnimation(detailsElement);
  }
  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        detailsElement.querySelectorAll('details').forEach((details) => {
          details.removeAttribute('open');
          details.classList.remove('menu-opening');
          details.classList.remove('submenu-open');
        });
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}
/**
 *  @class
 *  @function FullMenu
 */
if (!customElements.get('full-menu')) {
  class FullMenu extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.submenus = this.querySelectorAll('.thb-full-menu>.menu-item-has-children:not(.menu-item-has-megamenu)>.sub-menu');

      if (!this.submenus.length) {
        return;
      }
      const _this = this;
      // resize on initial load
      window.addEventListener('resize', debounce(function () {
        _this.resizeSubMenus();
      }, 100));

      window.dispatchEvent(new Event('resize'));

      document.fonts.ready.then(function () {
        _this.resizeSubMenus();
      });

    }
    resizeSubMenus() {
      this.submenus.forEach((submenu) => {
        let sub_submenus = submenu.querySelectorAll(':scope >.menu-item-has-children>.sub-menu');

        sub_submenus.forEach((sub_submenu) => {
          let w = sub_submenu.offsetWidth,
            l = sub_submenu.parentElement.parentElement.getBoundingClientRect().left + sub_submenu.parentElement.parentElement.clientWidth + 10,
            total = w + l;
          if (total > document.body.clientWidth) {
            sub_submenu.parentElement.classList.add('left-submenu');
          } else if (sub_submenu.parentElement.classList.contains('left-submenu')) {
            sub_submenu.parentElement.classList.remove('left-submenu');
          }
        });
      });
    }
  }
  customElements.define('full-menu', FullMenu);
}
/**
 *  @class
 *  @function PanelClose
 */
if (!customElements.get('side-panel-close')) {
  class PanelClose extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.cc = document.querySelector('.click-capture');

      this.onClick = (e) => {
        let panel = document.querySelectorAll('.side-panel.active');
        if (panel.length) {
          this.close_panel(e, panel[0]);
        }
      };
      // Add functionality to buttons
      this.addEventListener('click', this.onClick.bind(this));
      document.addEventListener('panel:close', this.onClick.bind(this));
      if (!this.cc.hasAttribute('initialized')) {
        this.cc.addEventListener('click', this.onClick.bind(this));
        this.cc.setAttribute('initialized', '');
      }

    }
    close_panel(e, panel) {
      if (e) {
        e.preventDefault();
      }
      if (!panel) {
        panel = e?.target.closest('.side-panel.active');

        if (!panel) {
          return;
        }
      }
      if (panel.classList.contains('product-drawer') || document.body.classList.contains('open-quick-view')) {
        this.close_quick_view();
      } else if (panel.classList.contains('cart-drawer')) {
        if (panel.querySelector('.product-recommendations--full')) {
          if (!document.body.classList.contains('open-quick-view')) {
            panel.querySelector('.product-recommendations--full').classList.remove('active');
          }
        }
        if (window.innerWidth < 1069) {
          if (!document.body.classList.contains('open-quick-view')) {
            panel.classList.remove('active');
            document.body.classList.remove('open-cc');
            document.body.classList.remove('open-cart');
          } else {
            this.close_quick_view();
          }
        } else {
          if (panel.querySelector('.product-recommendations--full')) {
            if (!document.body.classList.contains('open-quick-view')) {
              setTimeout(() => {
                panel.classList.remove('active');
                document.body.classList.remove('open-cc');
                document.body.classList.remove('open-cart');
              }, 500);
            } else {
              this.close_quick_view();
            }
          } else {
            panel.classList.remove('active');
            document.body.classList.remove('open-cc');
            document.body.classList.remove('open-cart');
          }
        }
      } else {
        panel.classList.remove('active');
        document.body.classList.remove('open-cc');
      }
    }
    close_quick_view() {
      let panel = document.getElementById('Product-Drawer');

      if (panel.querySelector('.product-quick-images--container')) {
        panel.querySelector('.product-quick-images--container').classList.remove('active');
      }
      if (window.innerWidth < 1069) {
        panel.classList.remove('active');
        if (!document.body.classList.contains('open-cart') || !document.body.classList.contains('open-quick-view')) {
          document.body.classList.remove('open-cc');
        }
        document.body.classList.remove('open-quick-view');
      } else {
        if (panel.querySelector('.product-quick-images--container')) {
          setTimeout(() => {
            panel.classList.remove('active');
            if (!document.body.classList.contains('open-cart') || !document.body.classList.contains('open-quick-view')) {
              document.body.classList.remove('open-cc');
            }
            document.body.classList.remove('open-quick-view');
            panel.querySelector('#Product-Drawer-Content').innerHTML = '';
          }, 500);
        }
      }
    }
  }
  customElements.define('side-panel-close', PanelClose);

  document.addEventListener('keyup', (e) => {
    if (e.code) {
      if (e.code.toUpperCase() === 'ESCAPE') {
        dispatchCustomEvent('panel:close');
      }
    }
  });
}
/**
 *  @class
 *  @function CartDrawer
 */
class CartDrawer {

  constructor() {
    this.container = document.getElementById('Cart-Drawer');

    if (!this.container) {
      return;
    }
    let _this = this,
      button = document.getElementById('cart-drawer-toggle'),
      quantities = this.container.querySelectorAll('.quantity input');


    // Add functionality to buttons
    button.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('open-cc');
      document.body.classList.add('open-cart');
      this.container.classList.add('active');
      this.container.focus();
      setTimeout(() => {
        if (this.container.querySelector('.product-recommendations--full')) {
          this.container.querySelector('.product-recommendations--full').classList.add('active');
        }
      });
      dispatchCustomEvent('cart-drawer:open');
    });

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    document.addEventListener('cart:refresh', (event) => {
      this.refresh();
    });

    this.container.addEventListener('change', this.debouncedOnChange.bind(this));

    this.notesToggle();
    this.removeProductEvent();
    this.updateFreeShipping();

    // Terms checkbox
    this.termsCheckbox();
  }
  onChange(event) {
    if (event.target.classList.contains('qty')) {
      this.updateQuantity(event.target.dataset.index, event.target.value);
    }
  }
  removeProductEvent() {
    let removes = this.container.querySelectorAll('.remove');

    removes.forEach((remove) => {
      remove.addEventListener('click', (event) => {
        this.updateQuantity(event.target.dataset.index, '0');

        event.preventDefault();
      });
    });
  }
  getSectionsToRender() {
    return [{
      id: 'Cart-Drawer',
      section: 'cart-drawer',
      selector: '.cart-drawer'
    },
    {
      id: 'cart-drawer-toggle',
      section: 'cart-bubble',
      selector: '.thb-item-count'
    }];
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
  termsCheckbox() {
    let terms_checkbox = this.container.querySelector('#CartDrawerTerms'),
      checkout_button = this.container.querySelector('.button.checkout');

    if (terms_checkbox && checkout_button) {
      terms_checkbox.setCustomValidity(theme.strings.requiresTerms);
      checkout_button.addEventListener('click', function (e) {
        if (!terms_checkbox.checked) {
          terms_checkbox.reportValidity();
          terms_checkbox.focus();
          e.preventDefault();
        }
      });
    }
  }
  notesToggle() {
    let notes_toggle = document.getElementById('order-note-toggle');

    if (!notes_toggle) {
      return;
    }

    notes_toggle.addEventListener('click', (event) => {
      notes_toggle.nextElementSibling.classList.add('active');
    });
    notes_toggle.nextElementSibling.querySelectorAll('.button, .order-note-toggle__content-overlay').forEach((el) => {
      el.addEventListener('click', (event) => {
        notes_toggle.nextElementSibling.classList.remove('active');
        this.saveNotes();
      });
    });
  }
  saveNotes() {
    fetch(`${theme.routes.cart_update_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/json`
      },
      body: JSON.stringify({
        'note': document.getElementById('mini-cart__notes').value
      })
    });
  }
  updateFreeShipping() {
    const free_shipping = this.container.querySelector('.free-shipping');

    if (free_shipping) {
      let amount_text = free_shipping.querySelector('.free-shipping--text span');
      let total = parseInt(free_shipping.dataset.cartTotal, 10);
      let minimum = Math.round(parseInt(free_shipping.dataset.minimum, 10) * (Shopify.currency.rate || 1));
      let percentage = 1;

      if (total < minimum) {
        percentage = total / minimum;

        if (amount_text) {
          let remaining = minimum - total,
            format = window.theme.settings.money_with_currency_format || "${{amount}}";
          amount_text.innerHTML = formatMoney(remaining, format);
        }
      }

      free_shipping.style.setProperty('--percentage', percentage);
    }
  }
  updateQuantity(line, quantity) {
    this.container.querySelector(`#CartDrawerItem-${line}`)?.classList.add('thb-loading');
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    dispatchCustomEvent('line-item:change:start', {
      quantity: quantity
    });
    if (this.container.querySelector('.product-recommendations--full')) {
      this.container.querySelector('.product-recommendations--full').classList.remove('active');
    }
    fetch(`${theme.routes.cart_change_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/json`
      },
      ...{
        body
      }
    })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        this.getSectionsToRender().forEach((section => {
          const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          if (parsedState.sections) {
            elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          }
        }));

        this.removeProductEvent();
        this.notesToggle();
        this.termsCheckbox();
        this.updateFreeShipping();
        dispatchCustomEvent('line-item:change:end', {
          quantity: quantity,
          cart: parsedState
        });

        if (this.container.querySelector(`#CartDrawerItem-${line}`)) {
          this.container.querySelector(`#CartDrawerItem-${line}`).classList.remove('thb-loading');
        }
      });
  }
  refresh() {
    if (this.container.querySelector('.product-recommendations--full')) {
      this.container.querySelector('.product-recommendations--full').classList.remove('active');
    }
    let sections = 'cart-drawer,cart-bubble';
    fetch(`${window.location.pathname}?sections=${sections}`)
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        this.getSectionsToRender().forEach((section => {
          const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState[section.section], section.selector);
        }));

        this.removeProductEvent();
        this.notesToggle();
        this.termsCheckbox();
        this.updateFreeShipping();
      });
  }
}

/**
 *  @class
 *  @function Localization
 */
class Localization {
  constructor() {
    let _this = this;
    // resize on initial load
    document.querySelectorAll('.thb-localization-forms').forEach((localization) => {
      localization.addEventListener('change', (e) => {
        localization.querySelector('form').submit();
      });
    });
  }
}



/**
 *  @class
 *  @function SelectWidth
 */
class SelectWidth {
  constructor() {
    let _this = this;
    // resize on initial load
    window.addEventListener('load', () => {
      document.querySelectorAll('.resize-select').forEach(_this.resizeSelect);
    });

    // delegated listener on change
    document.body.addEventListener('change', (e) => {
      if (e.target.matches('.resize-select') && e.target.offsetParent !== null) {
        _this.resizeSelect(e.target);
      }
    });
    window.addEventListener('resize.resize-select', function () {
      document.querySelectorAll('.resize-select').forEach(_this.resizeSelect);
    });
  }

  resizeSelect(sel) {
    let tempOption = document.createElement('option');
    tempOption.textContent = sel.selectedOptions[0].textContent;

    let tempSelect = document.createElement('select'),
      offset = 13;
    tempSelect.style.visibility = 'hidden';
    tempSelect.style.position = 'fixed';
    tempSelect.appendChild(tempOption);
    if (sel.classList.contains('thb-language-code') || sel.classList.contains('thb-currency-code') || sel.classList.contains('facet-filters__sort')) {
      offset = 2;
    }
    sel.after(tempSelect);
    if (tempSelect.clientWidth > 0) {
      sel.style.width = `${+tempSelect.clientWidth + offset}px`;
    }
    tempSelect.remove();
  }
}

if (typeof SelectWidth !== 'undefined') {
  new SelectWidth();
}

/**
 *  @class
 *  @function FooterMenuToggle
 */
class FooterMenuToggle {
  constructor() {
    let _this = this;
    // resize on initial load
    document.querySelectorAll('.thb-widget-title.collapsible').forEach((button) => {
      button.addEventListener('click', (e) => {
        button.classList.toggle('active');
      });
    });
  }
}

/**
 *  @class
 *  @function QuickView
 */
if (!customElements.get('quick-view')) {
  class QuickView extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.drawer = document.getElementById('Product-Drawer');
      this.body = document.body;

      this.addEventListener('click', this.setupEventListener.bind(this));

    }
    setupEventListener(e) {
      e.preventDefault();
      let productHandle = this.dataset.productHandle,
        href = `${theme.routes.root_url}/products/${productHandle}?view=quick-view`;

      // remove double `/` in case shop might have /en or language in URL
      href = href.replace('//', '/');
      if (!href || !productHandle) {
        return;
      }
      if (this.classList.contains('loading')) {
        return;
      }
      this.classList.add('loading');
      fetch(href, {
        method: 'GET'
      })
        .then((response) => {
          this.classList.remove('loading');
          return response.text();
        })
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('#Product-Drawer-Content').innerHTML;

          this.renderQuickview(sectionInnerHTML, href, productHandle);

        });
    }
    renderQuickview(sectionInnerHTML, href, productHandle) {

      if (sectionInnerHTML) {

        this.drawer.querySelector('#Product-Drawer-Content').innerHTML = sectionInnerHTML;

        let js_files = this.drawer.querySelector('#Product-Drawer-Content').querySelectorAll('script');

        if (js_files.length > 0) {
          var head = document.getElementsByTagName('head')[0];
          js_files.forEach((js_file, i) => {
            let script = document.createElement('script');
            script.src = js_file.src;
            head.appendChild(script);
          });
        }

        setTimeout(() => {
          if (Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
          if (window.ProductModel) {
            window.ProductModel.loadShopifyXR();
          }
        }, 300);

        this.body.classList.add('open-cc');
        this.body.classList.add('open-quick-view');
        this.drawer.classList.add('active');

        this.drawer.querySelector('.side-panel-close').focus();

        setTimeout(() => {
          this.drawer.querySelector('.product-quick-images--container').classList.add('active');
        });
        dispatchCustomEvent('quick-view:open', {
          productUrl: href,
          productHandle: productHandle
        });
        addIdToRecentlyViewed(productHandle);
        jQuery(function($) {
          $("#Product-Drawer .tab_variants .danns").on("click", function (event) {
            $('#Product-Drawer .tab_variants .danns').removeClass('active');
            $(this).addClass('active');
            var type=$(this).data('type');
            $('#Product-Drawer .show_variants').removeClass('active');
            $('#Product-Drawer #'+type+'_type').addClass('active');
            $.cookie('inkasstype', type, { expires: 31, path: '/' });
          })

          if ($('#Product-Drawer .tab_variants').length > 0) {
            if ( $.cookie('inkasstype') != undefined ) {
              console.log($.cookie('inkasstype'));
              var type=$.cookie('inkasstype');
              if ($('#Product-Drawer #tab_type_'+type).length > 0) {
                $('#Product-Drawer .tab_variants .danns').removeClass('active');
                $('#Product-Drawer #tab_type_'+type).addClass('active');

                $('#Product-Drawer .show_variants').removeClass('active');
                $('#Product-Drawer #'+type+'_type').addClass('active');
              }
            }
          }
        });

        jQuery(function($) {
          jQuery("#Product-Drawer .product-form__input_dann label").on("click", function (event) {

            var var_id=$(this).data('variantid');
            var title=$(this).data('title');
            var titleshort=$(this).data('titleshort');
            //$('#Product-Drawer .product-form form input[name="id"]').val(var_id);
            history.pushState({}, null, '?variant='+var_id);
            console.log(titleshort+'==titleshort');
            $('#Product-Drawer .main_prod_'+titleshort+'').click();
            $('#Product-Drawer .product_'+titleshort+'').click();
            // $('[data-inputshort="'+titleshort+'"]').attr('checked', true);


            $('#Product-Drawer variant-radios').change();


            if ($(this).hasClass('available_true')) {
              $('#Product-Drawer .product-form__submit').html('Add to cart');
              $('#Product-Drawer .product-form__submit').prop("disabled", false);
            }
            if ($(this).hasClass('available_false')) {
              $('#Product-Drawer .product-form__submit').html('Sold out');
              $('#Product-Drawer .product-form__submit').prop("disabled", true);
            }
          })
        })
      }
    }
  }
  customElements.define('quick-view', QuickView);
}

/**
 *  @class
 *  @function SidePanelContentTabs
 */
if (!customElements.get('side-panel-content-tabs')) {
  class SidePanelContentTabs extends HTMLElement {
    constructor() {
      super();
      this.buttons = this.querySelectorAll('button');
      this.panels = this.parentElement.querySelectorAll('.side-panel-content--tab-panel');
    }
    connectedCallback() {
      this.setupButtonObservers();
    }
    disconnectedCallback() {

    }
    setupButtonObservers() {
      this.buttons.forEach((item, i) => {
        item.addEventListener('click', (e) => {
          this.toggleActiveClass(i);
        });
      });
    }
    toggleActiveClass(i) {
      this.buttons.forEach((button) => {
        button.classList.remove('tab-active');
      });
      this.buttons[i].classList.add('tab-active');

      this.panels.forEach((panel) => {
        panel.classList.remove('tab-active');
      });
      this.panels[i].classList.add('tab-active');
    }
  }

  customElements.define('side-panel-content-tabs', SidePanelContentTabs);
}

/**
 *  @class
 *  @function CollapsibleRow
 */
if (!customElements.get('collapsible-row')) {
  // https://css-tricks.com/how-to-animate-the-details-element/
  class CollapsibleRow extends HTMLElement {
    constructor() {
      super();

      this.details = this.querySelector('details');
      this.summary = this.querySelector('summary');
      this.content = this.querySelector('.collapsible__content');

      // Store the animation object (so we can cancel it if needed)
      this.animation = null;
      // Store if the element is closing
      this.isClosing = false;
      // Store if the element is expanding
      this.isExpanding = false;
    }
    connectedCallback() {
      this.setListeners();
    }
    setListeners() {
      this.querySelector('summary').addEventListener('click', (e) => this.onClick(e));
    }
    instantClose() {
      this.tl.timeScale(10).reverse();
    }
    animateClose() {
      this.tl.timeScale(3).reverse();
    }
    animateOpen() {
      this.tl.timeScale(1).play();
    }
    onClick(e) {
      // Stop default behaviour from the browser
      e.preventDefault();
      // Add an overflow on the <details> to avoid content overflowing
      this.details.style.overflow = 'hidden';
      // Check if the element is being closed or is already closed
      if (this.isClosing || !this.details.open) {
        this.open();
        // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.details.open) {
        this.shrink();
      }
    }
    shrink() {
      // Set the element as "being closed"
      this.isClosing = true;

      // Store the current height of the element
      const startHeight = `${this.details.offsetHeight}px`;
      // Calculate the height of the summary
      const endHeight = `${this.summary.offsetHeight}px`;

      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }

      // Start a WAAPI animation
      this.animation = this.details.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        // duration: 350,
        duration: 1000,
        easing: 'ease'
      });

      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(false);
      // If the animation is cancelled, isClosing variable is set to false
      this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
      // Apply a fixed height on the element
      this.details.style.height = `${this.details.offsetHeight}px`;
      // Force the [open] attribute on the details element
      this.details.open = true;
      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      // Set the element as "being expanding"
      this.isExpanding = true;
      // Get the current fixed height of the element
      const startHeight = `${this.details.offsetHeight}px`;
      // Calculate the open height of the element (summary height + content height)
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }

      // Start a WAAPI animation
      this.animation = this.details.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 1000,
        easing: 'ease'
        // duration: 400,
        // easing: 'ease-out'
      });
      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(true);
      // If the animation is cancelled, isExpanding variable is set to false
      this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
      // Set the open attribute based on the parameter
      this.details.open = open;
      // Clear the stored animation
      this.animation = null;
      // Reset isClosing & isExpanding
      this.isClosing = false;
      this.isExpanding = false;
      // Remove the overflow hidden and the fixed height
      this.details.style.height = this.details.style.overflow = '';
    }
  }
  customElements.define('collapsible-row', CollapsibleRow);
}

/**
 *  @function addIdToRecentlyViewed
 */
function addIdToRecentlyViewed(handle) {

  if (!handle) {
    let product = document.querySelector('.thb-product-detail');

    if (product) {
      handle = product.dataset.handle;

      if (!handle) {
        return;
      }
    }
  }
  if (window.localStorage) {
    let recentIds = window.localStorage.getItem('recently-viewed');
    if (recentIds != 'undefined' && recentIds != null) {
      window.recentlyViewedIds = JSON.parse(recentIds);
    }
  }
  // Remove current product if already in recently viewed array
  var i = window.recentlyViewedIds.indexOf(handle);

  if (i > -1) {
    window.recentlyViewedIds.splice(i, 1);
  }

  // Add id to array
  window.recentlyViewedIds.unshift(handle);

  if (window.localStorage) {
    window.localStorage.setItem('recently-viewed', JSON.stringify(window.recentlyViewedIds));
  }
}

document.addEventListener('DOMContentLoaded', () => {

  if (typeof Localization !== 'undefined') {
    new Localization();
  }
  if (typeof CartDrawer !== 'undefined') {
    new CartDrawer();
  }
  if (typeof Header !== 'undefined') {
    new Header();
  }
  if (typeof FooterMenuToggle !== 'undefined') {
    new FooterMenuToggle();
  }
});