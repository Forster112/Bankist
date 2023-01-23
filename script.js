'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // Scrolling
  // old method
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //new method
  section1.scrollIntoView({ behavior: 'smooth' });
});

// rgb(204,198,204)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(
  ${randomInt(0, 255)},
  ${randomInt(0, 255)},
  ${randomInt(0, 255)}
)`;

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });

// section1.style.backgroundColor = randomColor();

////////////////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/* Using Event delegation*/
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Components
tabsContainer.addEventListener('click', function (e) {
  // e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  // Guard Clause to prevent error if other parts is clicked
  if (!clicked) return;

  // Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  // View  Active Content

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// IMPORTANT Scroll event is available on window and not document

// const initiaCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > initiaCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// // BEST
// // Sticky navigation: Intersection Observer
// const obCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };
// const obOptions = {
//   // The entire viewport
//   root: null,
//   // IMPORTANT threshold is the persentage of the section needed that is visible
//   threshold: 0.1,
// };
// const interOb = new IntersectionObserver(obCallback, obOptions);
// interOb.observe(section1);

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // entries is an array of intersecting times
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal Sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace data-src with src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;
// slider.style.overflow = 'visible';

// Function

const sliders = function (slide) {
  slideMovement(slide);
  activateDot(slide);
};

const slideMovement = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
slideMovement(0);

const nextSlide = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  sliders(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  sliders(curSlide);
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activateDot = function (curslide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${curslide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

// Event handlers
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Dots

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const sli = e.target.dataset.slide;
    sliders(sli);
  }
});

////////////////////////////////////////////
///////////////////////////////////////////
// LECTURES
// console.log(document.documentElement);
// console.log(document.body);

// const allSection = document.querySelectorAll('.section');
// console.log(allSection);
// console.log([...allSection]);

// const header = document.querySelector('.header');

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookie for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.append(message);

// // header.append(message.cloneNode(true));

// const btnCloseCookie = document.querySelector('.btn--close-cookie');
// btnCloseCookie.addEventListener('click', () => message.remove());

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'purple')

//IMPORTANT

// /* event handler that triggers when a page have
//     downloaded all its html and convert them to document */
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('Welcome');
// });

// /* event that triggers when every item of a page
//     is fully loaded */
// window.addEventListener('load', function (e) {
//   console.log('Your page is ready');
// });

// /* event that triggers immediately the user tries
//     to close the page */
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   // alert('Are you sure u want to leave?');
//   e.returnValue = '';
// });
