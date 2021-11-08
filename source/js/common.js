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
  constructor (options) {
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
      window.scroll({ top: pagePosition, left: 0 });
      document.body.removeAttribute('data-position');
  }

  lockPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    document.body.style.paddingRight = paddingOffset;
  }

  unlockPadding () {
    this.fixBlocks.forEach((el) => {
    el.style.paddingRight = '0px';
    });
    document.body.style.paddingRight = '0px';
  }
}

// let currentTabContent = [];
// let currentTabLinks = [];

const modal = new Modal({
  onOpen: (modal) => {
      console.log(modal);
      console.log('opened');
  },
  onClose: () => {
      // tabsCleanup();
  },
});

// function tabsCleanup() {
//   // remove 'active' class names
//   currentTabContent.forEach(tabContent => tabContent.classList.remove('active'));
//   currentTabLinks.forEach(tabLink => tabLink.classList.remove("active"));

//   // set the first tab as active
//   const firstTabButton = currentTabLinks[0];
//   const firstTabContent = currentTabContent.find(element => element.id === firstTabButton.dataset.tabContentId);

//   firstTabButton.classList.add('active');
//   firstTabContent.classList.add('active');

//   currentTabContent = [];
//   currentTabLinks = [];
// }

//

// disable
const disableBannerBtn = [...document.querySelectorAll('.bonus__tab')];
const bannerSlider = document.querySelector('.bonus__banner');

disableBannerBtn.forEach(function (disableBtn) {
  disableBtn.addEventListener('click', function () {
    bannerSlider.classList.add('disable');
  });
});

// tab Andrey
function itemTabs(evt) {
  // const currentTabContent = [];
  // const currentTabLinks = [];

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
  bannerSlider.classList.remove('disable');
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
window.addEventListener("DOMContentLoaded", function() {
  [].forEach.call( document.querySelectorAll('.tel'), function(input) {
  var keyCode;
  function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___-__-__",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function(a) {
              return i < val.length ? val.charAt(i++) || def.charAt(i) : a
          });
      i = new_value.indexOf("_");
      if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
          function(a) {
              return "\\d{1," + a.length + "}"
          }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5)  this.value = "";
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false)

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


