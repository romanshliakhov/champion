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
          isOpen: () => {},
          isClose: () => {},
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
          this.options.isOpen(this);
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
          this.options.isClose(this);
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

const modal = new Modal({
  isOpen: (modal) => {
      console.log(modal);
      console.log('opened');
  },
  isClose: () => {
      console.log('closed');
  },
});

// tabs
document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelector('.tabs');
	const tabsBtn = document.querySelectorAll('.tabs__btn');
	const tabsContent = document.querySelectorAll('.tabs__content');

	if (tabs) {
		tabs.addEventListener('click', (e) => {
			if (e.target.classList.contains('tabs__btn')) {
				const tabsPath = e.target.dataset.tabsPath;
				tabsBtn.forEach(el => {
          el.classList.remove('tabs__btn--active');
        });
				document.querySelector(`[data-tabs-path="${tabsPath}"]`).classList.add('tabs__btn--active');
				tabsHandler(tabsPath);
			}
		});
	}

	const tabsHandler = (path) => {
		tabsContent.forEach(el => {
      el.classList.remove('tabs__content--active');
    });
		document.querySelector(`[data-tabs-target="${path}"]`).classList.add('tabs__content--active');
	};
});

// class Tabs {
//   constructor(root) {
//       this.root = root;
//       this.list = this.root.querySelector(':scope > [data-list]');
//       this.buttons = new Map([...this.list.querySelectorAll(':scope > [data-target]')]
//           .map(entry => [
//               entry.dataset.target,
//               entry,
//           ])
//       );
//       this.containers = new Map([...this.root.querySelectorAll(':scope > [data-tab]')]
//           .map(entry => [entry.dataset.tab, entry])
//       );
//       this.salt = Math.random().toString(36).slice(2);
//       this.current = null;
//       this.active = null;
//   }

//   select(name) {
//       const keys = [...this.buttons.keys()];

//       for (let [key, button] of this.buttons.entries()) {
//           button.setAttribute('aria-selected', key === name);
//       }

//       for (let [key, container] of this.containers.entries()) {
//           if (key === name) {
//               container.removeAttribute('hidden');
//           } else {
//               container.setAttribute('hidden', true);
//           }
//       }

//       this.active = keys.indexOf(name);
//   }

//   init() {
//       const keys = [...this.buttons.keys()];

//       this.list.setAttribute('role', 'tablist');

//       this.list.addEventListener('keydown', event => {
//           if (event.code === 'Home') {
//               event.preventDefault();

//               this.buttons.get(keys[0]).focus();
//           }

//           if (event.code === 'End') {
//               event.preventDefault();

//               this.buttons.get(keys[keys.length - 1]).focus();
//           }

//           if (event.code === 'ArrowLeft') {
//               event.preventDefault();

//               this.buttons.get(keys[Math.max(0, this.current - 1)]).focus();
//           }

//           if (event.code === 'ArrowRight') {
//               event.preventDefault();

//               this.buttons.get(keys[Math.min(keys.length - 1, this.current + 1)]).focus();
//           }
//       });

//       for (let [key, button] of this.buttons.entries()) {
//           button.setAttribute('tabindex', '0');
//           button.setAttribute('id', `button_${this.salt}_=${key}`);
//           button.setAttribute('role', 'tab');
//           button.setAttribute('aria-controls', `container_${this.salt}_${key}`);

//           button.addEventListener('click', event => {
//               event.preventDefault();

//               this.select(key);
//           });

//           button.addEventListener('focus', event => {
//               this.current = keys.indexOf(key);
//           });

//           button.addEventListener('keypress', event => {
//               if (event.code === 'Enter' || event.code === 'Space') {
//                   event.preventDefault();

//                   this.select(key);
//               }
//           });
//       }

//       for (let [key, container] of this.containers.entries()) {
//           container.setAttribute('id', `container_${this.salt}_${key}`);
//           container.setAttribute('role', 'tabpanel');
//           container.setAttribute('aria-labelledby', `button_${this.salt}_${key}`);
//       }

//       this.select(keys[0]);
//   }

//   static create(element) {
//       const instance = new Tabs(element);
//       instance.init();

//       return instance;
//   }
// }

// const containers = document.querySelectorAll('[data-tabs]');

// for (let container of containers) {
//   const tabs = Tabs.create(container);
//   console.log(tabs);
// }

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
let calculatorElem = document.querySelector('.cashier__form, .sberbank__form'),
    input = calculatorElem.querySelector('.modal__inner-input, .sberbank__form-input');

calculatorElem.addEventListener('click', evt => {
  if (evt.target.matches('.cashier__form-btn, .sberbank__form-btn')) {
    input.value = evt.target.value;
  } else if (evt.target.matches('.action')) {
    // ...
  }
});

// inputMask
let inputs = document.querySelectorAll('input[type="tel"]');
let im = new Inputmask('+7 (999) 999-99-99');
im.mask(inputs);

// validate
// function validateForms(selector, rules) {
//   new window.JustValidate(selector, {
//       rules: rules,
//       submitHandler: function (form, values, ajax) {
//           console.log(form);

//           let formData = new FormData(form);

//           fetch("mail.php", {
//               method: "POST",
//               body: formData
//           })
//           .then(function(data) {
//               console.log(data);
//               console.log('Отправлено');
//               form.reset();
//           });
//       }
//   });
// }

// validateForms('.form', { email: { required: true, email: true }, fio: { required: true }, tel: { required: true } });


