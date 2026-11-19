const carousel = document.querySelector('[data-project-carousel]');
const container = carousel.querySelector('.project-carousel-slides');
const slides = [...container.querySelectorAll('.project-slide')];
const controls = carousel.querySelector('.project-carousel-controls');
const rotation = carousel.querySelector('[data-rotation]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let order = [...slides];
let index = 0;
let playing = !reducedMotion.matches;
let timer;

function shuffle(previous) {
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order[0] === previous) {
    const j = 1 + Math.floor(Math.random() * (order.length - 1));
    [order[0], order[j]] = [order[j], order[0]];
  }
}

function show(indexToShow) {
  index = indexToShow;
  for (const slide of slides) {
    slide.hidden = slide !== order[index];
  }
}

function advance() {
  if (index === order.length - 1) {
    shuffle(order[index]);
    show(0);
  } else {
    show(index + 1);
  }
}

function setPlaying(value) {
  playing = value;
  rotation.toggleAttribute('data-playing', playing);
  rotation.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  container.setAttribute('aria-live', playing ? 'off' : 'polite');
  window.clearInterval(timer);
  if (playing) {
    timer = window.setInterval(advance, 6000);
  }
}

if (slides.length > 1) {
  shuffle();
  show(0);
  controls.hidden = false;
  setPlaying(playing);

  rotation.addEventListener('click', () => setPlaying(!playing));
  carousel.querySelector('[data-next]').addEventListener('click', () => {
    setPlaying(false);
    advance();
  });
  carousel.querySelector('[data-previous]').addEventListener('click', () => {
    setPlaying(false);
    show((index - 1 + order.length) % order.length);
  });
  container.addEventListener('focusin', () => setPlaying(false));
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) setPlaying(false);
  });
}
