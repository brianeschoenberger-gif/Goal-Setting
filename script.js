const revealTargets = document.querySelectorAll('.reveal-target');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: '0px 0px -10% 0px',
  },
);

revealTargets.forEach((element) => observer.observe(element));
