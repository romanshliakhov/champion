// slider
let banner = new Swiper('.banner__swiper', {
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

let bonusBanner = new Swiper('.bonus__banner-swiper', {
  loop: true,
  loopedSlides: 0,
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
});

// modals
class Modal {
  constructor(options) {
    let defaultOptions = {
      onOpen: () => {},
      onClose: () => {},
    };
    this.options = Object.assign(defaultOptions, options);
    this.modal = document.querySelector('.modal');
    this.speed = false;
    this.animation = false;
    this.isOpen = false;
    this.modalContainer = false;
    this.previousActiveElement = false;
    this.fixBlocks = document.querySelectorAll('.fix-block');
    this.focusElements = [
      'a[href]',
      'input',
      'button',
      'select',
      'textarea',
      '[tabindex]'
    ];
    this.events();
  }

  events() {
    if (this.modal) {
      document.addEventListener('click', function (e) {
        const clickedElement = e.target.closest('[data-path]');
        if (clickedElement) {
          if (this.isOpen) {
            this.close();
          }
          let target = clickedElement.dataset.path;
          let animation = clickedElement.dataset.animation;
          let speed = clickedElement.dataset.speed;
          this.animation = animation ? animation : 'fade';
          this.speed = speed ? parseInt(speed) : 300;
          this.modalContainer = document.querySelector(`[data-target="${target}"]`);
          this.open();
          return;
        }

        if (e.target.closest('.modal-close')) {
          this.close();
          return;
        }
      }.bind(this));

      window.addEventListener('keydown', function (e) {
        if (e.keyCode == 27) {
          if (this.isOpen) {
            this.close();
          }
        }
      }.bind(this));

      this.modal.addEventListener('click', function (e) {
        if (!e.target.classList.contains('.modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
          this.close();
        }
      }.bind(this));
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;

    this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
    this.modal.classList.add('is-open');
    this.disableScroll();

    this.modalContainer.classList.add('modal-open');
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.modalContainer.classList.add('animate-open');
      this.options.onOpen(this);
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove('animate-open');
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove('is-open');
      this.modalContainer.classList.remove('modal-open');

      this.enableScroll();
      this.options.onClose(this);
      this.isOpen = false;
      this.focusTrap();
    }
  }

  focusCatch(e) {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }

    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    if (this.isOpen) {
      focusable[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    let pagePosition = window.scrollY;
    this.lockPadding();
    document.body.classList.add('disable-scroll');
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + 'px';
  }

  enableScroll() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    this.unlockPadding();
    document.body.style.top = 'auto';
    document.body.classList.remove('disable-scroll');
    window.scroll({
      top: pagePosition,
      left: 0
    });
    document.body.removeAttribute('data-position');
  }

  lockPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    document.body.style.paddingRight = paddingOffset;
  }

  unlockPadding() {
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = '0px';
    });
    document.body.style.paddingRight = '0px';
  }
}

const modal = new Modal({
  onOpen: (modal) => {
    console.log(modal);
    console.log('opened');
  },
  onClose: () => {
    const bonusBanners = [...document.getElementsByClassName('bonus__banner')];

    if (bonusBanners.length) {
      bonusBanners.forEach((bonusBanner) => bonusBanner.classList.remove('disable'));
    }
  },
});

// disable
const disableBannerBtn = [...document.querySelectorAll('.bonus__tab')];
const bannerSliders = [...document.querySelectorAll('.bonus__banner')];

disableBannerBtn.forEach((disableBtn) => {
  disableBtn.addEventListener('click', () => {
    bannerSliders.forEach((bannerSlider) => bannerSlider.classList.add('disable'));
  });
});

// tabs
function itemTabs(evt) {
  const navName = evt.target.dataset.tabContentId;

  const tabsContainer = evt.target.closest('.tabs');
  const tabsButton = evt.currentTarget;
  const tabContent = document.getElementById(navName);
  const bonusBanner = tabsContainer.querySelector('.bonus__banner');

  if (bonusBanner) {
    bonusBanner.classList.remove('disable');
  }

  const currentTabContent = [...tabsContainer.getElementsByClassName("tabcontent")];
  currentTabContent.forEach(tabContent => tabContent.classList.remove('active'));

  const currentTabLinks = [...tabsContainer.getElementsByClassName("tablinks")];
  currentTabLinks.forEach(tabLink => tabLink.classList.remove("active"));

  tabContent.classList.add('active');
  tabsButton.classList.add('active');
}

function bannerTabs(evt) {
  const navName = evt.target.dataset.tabContentId;

  const tabsContainer = evt.target.closest('.tabs');
  const tabsButton = evt.currentTarget;
  const tabContent = document.getElementById(navName);

  const currentTabContent = [...tabsContainer.getElementsByClassName("tabcontent")];
  currentTabContent.forEach(tabContent => tabContent.classList.remove('active'));

  const currentTabLinks = [...tabsContainer.getElementsByClassName("tablinks")];
  currentTabLinks.forEach(tabLink => tabLink.classList.remove("active"));

  tabContent.classList.add('active');
  tabsButton.classList.add('active');
}


// dropdown
document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

  dropDownBtn.addEventListener('click', function (e) {
    console.log("click :>> ", "dropDownBtn");
    dropDownList.classList.toggle('dropdown__list--visible');
    this.classList.add('dropdown__button--active');
  });

  dropDownListItems.forEach(function (listItem) {
    listItem.addEventListener('click', function (e) {
      console.log("click :>> ", "dropDownListItem");
      e.stopPropagation();
      dropDownBtn.innerHTML = this.innerHTML;
      dropDownBtn.focus();
      dropDownInput.value = this.dataset.value;
      dropDownList.classList.remove('dropdown__list--visible');
      this.classList.remove('dropdown__button--active');
    });
  });

  document.addEventListener('click', function (e) {
    console.log("click :>> ", dropDownBtn.contains(e.target));
    if (!dropDownBtn.contains(e.target)) {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });
});

// accordeon
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

// calculator
const calculatorElements = [...document.querySelectorAll('.cashier__form')];

calculatorElements.forEach(calculatorElemnt => {
  const input = calculatorElemnt.querySelector('.modal__inner-input');

  calculatorElemnt.addEventListener('click', evt => {
    if (evt.target.matches('.cashier__form-btn')) {
      input.value = evt.target.value;
    } else if (evt.target.matches('.action')) {
      // ...
    }
  });
});

// imput Mask
let selector = document.querySelectorAll('input[type="tel"]');
let im = new Inputmask('+9 (999) 999-99-99');
im.mask(selector);

// menu dropdown
(function () {
  'use strict';

  // ???????????????????????? ?????????????? CLICK
  document.addEventListener('click', EasyTogglerHandler);

  /**
   * ???????????????? ??????????????-???????????????????? EasyToggler.
   */
  function EasyTogglerHandler(event) {

    // ???????????? ???????????????? ???????????? EasyToggler
    const EY_BTN = event.target.closest('[data-easy-toggle]');

    /**
     * ???????????????? ?????????????? ???? ???????????????? ???????????? EasyToggle ??
     * ???????????????? ???? ?????????????? ?????? ?????? ????????????
     */

    if (EY_BTN) {
      event.preventDefault();
      let ey_target = EY_BTN.getAttribute('data-easy-toggle');
      let ey_class = EY_BTN.getAttribute('data-easy-class');

      try {
        document.querySelectorAll('[data-easy-toggle]').forEach(easyBlock => {
          if (!easyBlock.hasAttribute('data-easy-parallel') && easyBlock !== EY_BTN) {
            document.querySelector(easyBlock.getAttribute('data-easy-toggle')).classList.remove(easyBlock.getAttribute('data-easy-class'));
          }
        });

        document.querySelector(ey_target).classList.toggle(ey_class);
      } catch (ey_error) {
        console.warn('EasyToggler.js : ???????? ' + ey_target + ' ???? ????????????????????');
      }
    }

    if (!EY_BTN) {
      // ???????????????? ???????????? ???? ???????????? ?? ?????????????????? [data-easy-rcoe]
      let ey_rcoe_block_targets = document.querySelectorAll('[data-easy-rcoe]');

      /**
       * ???????????? ?????????????? ???? ???????????? ????????????, ?? ?????????????? ????????????
       * ?????????????? [data-easy-rcoe], ?????????? ?????????????? ???????????????? ??????????
       */
      Array.from(ey_rcoe_block_targets).forEach.call(ey_rcoe_block_targets, function (ey_rcoe_block_target) {
        let ey_rcoe_block = ey_rcoe_block_target.getAttribute('data-easy-toggle'), // ???????????????? ???????????????????? ????????
          ey_rcoe_block_class = ey_rcoe_block_target.getAttribute('data-easy-class'); // ?????????????? ???????????????? ??????????

        /* ???????? ???????????????? ???? ???? ???????????????? ????????, ???? ?????????????? ???????????????? ?????????? */
        if (!event.target.closest(ey_rcoe_block)) {
          try {
            document.querySelector(ey_rcoe_block).classList.remove(ey_rcoe_block_class);
          } catch (ey_error) {
            console.warn('EasyToggler.js : ???????? ' + ey_rcoe_block + ' ???? ????????????????????');
          }
        }
      });
    }
  }
})();



