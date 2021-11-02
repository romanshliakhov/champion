// alert
let playWithoutLimits = document.querySelector('.games__item-status--demo');

playWithoutLimits.onclick = function () {
  playWithoutLimits.classList.toggle('games__item-status--reg');
};

// modal
$('[data-modal=registration]').on('click', function () {
  $('.overlay, #registration').fadeIn();
});

$('.modal__close').on('click', function () {
  $('.overlay, #registration').fadeOut();
});


// modal
// (document.getElementById("popup").onclick = function () {
//   document.getElementById("overlay").classList.toggle("overlay--active"),
//     document.getElementById("modal").classList.toggle("modal--active");
// }),
// (document.getElementById("modal-close").onclick = function () {
//   document.getElementById("overlay").classList.remove("overlay--active"),
//     document.getElementById("modal").classList.remove("modal--active");
// }),
// document.getElementById("overlay").addEventListener("click", function (e) {
//   "overlay" == e.target.id &&
//     (this.classList.remove("overlay--active"),
//       document.getElementById("modal").classList.remove("modal--active"));
// });

// popup
const popupLinks = document.querySelectorAll(".popup-link");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeOut = 800;

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute("href").replace("#", " ");
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      e.preventDefault();
    });
  }
}

