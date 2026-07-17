const revealItems = [...document.querySelectorAll('section:not(.reveal-on-load)')];
const heroSceneArea = document.querySelector('.hero');
const capturesCarousel = document.querySelector('[data-captures-carousel]');
const carouselPrev = document.querySelector('[data-carousel-prev]');
const carouselNext = document.querySelector('[data-carousel-next]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const getRuntimeBase = (port) => {
  const protocol =
    window.location.protocol === 'http:' || window.location.protocol === 'https:'
      ? window.location.protocol
      : 'http:';
  const hostname = window.location.hostname || 'localhost';
  return `${protocol}//${hostname}:${port}`;
};

for (const link of document.querySelectorAll('[data-runtime-link]')) {
  const target = link.getAttribute('data-runtime-link');

  if (target === 'frontend') {
    link.href = `${getRuntimeBase(4200)}/`;
    continue;
  }

  if (target === 'checkout') {
    link.href = `${getRuntimeBase(8080)}/api/checkout/start`;
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'is-visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.14 }
);

for (const item of revealItems) {
  item.classList.add('reveal');
  observer.observe(item);
}

if (heroSceneArea && !reduceMotion.matches) {
  const updateScene = (event) => {
    const bounds = heroSceneArea.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroSceneArea.style.setProperty('--scene-shift-x', `${x * 26}px`);
    heroSceneArea.style.setProperty('--scene-shift-y', `${y * 22}px`);
  };

  heroSceneArea.addEventListener('pointermove', updateScene);
  heroSceneArea.addEventListener('pointerleave', () => {
    heroSceneArea.style.setProperty('--scene-shift-x', '0px');
    heroSceneArea.style.setProperty('--scene-shift-y', '0px');
  });
}

if (heroSceneArea) {
  let ticking = false;

  const updateHeroFade = () => {
    const bounds = heroSceneArea.getBoundingClientRect();
    const distance = Math.max(window.innerHeight * 0.7, 1);
    const progress = Math.min(Math.max(-bounds.top / distance, 0), 1);
    const fade = 1 - progress * 0.9;
    const lift = Math.round(progress * -36);

    heroSceneArea.style.setProperty('--hero-fade', fade.toFixed(3));
    heroSceneArea.style.setProperty('--hero-lift', `${lift}px`);
    ticking = false;
  };

  const requestHeroFade = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeroFade);
  };

  updateHeroFade();
  window.addEventListener('scroll', requestHeroFade, { passive: true });
  window.addEventListener('resize', requestHeroFade);
}

if (capturesCarousel && carouselPrev && carouselNext) {
  const getStep = () => {
    const firstCard = capturesCarousel.querySelector('.capture-card');
    if (!firstCard) return capturesCarousel.clientWidth;

    const carouselStyles = window.getComputedStyle(capturesCarousel);
    const columnGap = Number.parseFloat(carouselStyles.columnGap) || 0;
    return firstCard.getBoundingClientRect().width + columnGap;
  };

  const updateCarouselButtons = () => {
    const maxScrollLeft = capturesCarousel.scrollWidth - capturesCarousel.clientWidth - 4;
    carouselPrev.disabled = capturesCarousel.scrollLeft <= 4;
    carouselNext.disabled = capturesCarousel.scrollLeft >= maxScrollLeft;
  };

  const moveCarousel = (direction) => {
    capturesCarousel.scrollBy({
      left: getStep() * direction,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  };

  carouselPrev.addEventListener('click', () => moveCarousel(-1));
  carouselNext.addEventListener('click', () => moveCarousel(1));
  capturesCarousel.addEventListener('scroll', updateCarouselButtons, { passive: true });
  window.addEventListener('resize', updateCarouselButtons);
  updateCarouselButtons();
}
