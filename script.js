const revealItems = [...document.querySelectorAll('section:not(.reveal-on-load)')];

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
