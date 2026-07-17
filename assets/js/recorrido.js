(() => {
  const getRuntimeBase = (port) => {
    const protocol =
      window.location.protocol === 'http:' || window.location.protocol === 'https:'
        ? window.location.protocol
        : 'http:';
    const hostname = window.location.hostname || 'localhost';
    return `${protocol}//${hostname}:${port}`;
  };

  for (const link of document.querySelectorAll('[data-runtime-link="frontend"]')) {
    link.href = `${getRuntimeBase(4200)}/`;
  }

  const carousel = document.querySelector('[data-tour-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('[data-tour-slide]')];
  const prevButton = carousel.querySelector('[data-tour-prev]');
  const nextButton = carousel.querySelector('[data-tour-next]');
  const dots = [...document.querySelectorAll('[data-tour-dot]')];
  const count = document.querySelector('[data-tour-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  const update = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
      slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (count) {
      count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  };

  prevButton?.addEventListener('click', () => update(activeIndex - 1));
  nextButton?.addEventListener('click', () => update(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => update(index));
  });

  carousel.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  carousel.addEventListener(
    'touchmove',
    (event) => {
      touchDeltaX = event.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  carousel.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < 40) return;
    update(activeIndex + (touchDeltaX < 0 ? 1 : -1));
  });

  document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const hasFocusInside = activeElement && carousel.contains(activeElement);
    if (!carousel.matches(':hover') && !hasFocusInside) return;
    if (event.key === 'ArrowLeft') update(activeIndex - 1);
    if (event.key === 'ArrowRight') update(activeIndex + 1);
  });

  if (reduceMotion) {
    slides.forEach((slide) => {
      slide.style.transition = 'none';
    });
  }

  update(0);
})();
