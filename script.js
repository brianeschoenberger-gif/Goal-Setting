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
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
  },
);

revealTargets.forEach((element) => observer.observe(element));

const journeyStage = document.getElementById('wellness-panel');
const morphLayers = journeyStage ? journeyStage.querySelectorAll('.morph-layer') : [];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

const getScrollProgress = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const entryPoint = viewportHeight * 0.88;
  const travel = viewportHeight * 1.15 + rect.height;
  return clamp((entryPoint - rect.top) / travel, 0, 1);
};

const getMorphFrame = (progress, offset = 0) => {
  const phase = clamp(progress + offset, 0, 1);
  return {
    radius: [
      lerp(40, 58, phase),
      lerp(60, 42, phase),
      lerp(62, 44, phase),
      lerp(38, 56, phase),
      lerp(54, 38, phase),
      lerp(43, 60, phase),
      lerp(57, 40, phase),
      lerp(46, 63, phase),
    ],
    x: lerp(-2.5, 2.5, phase),
    y: lerp(2, -2, phase),
    rotate: lerp(-3, 3, phase),
  };
};

const applyMorphStyles = () => {
  if (!journeyStage || morphLayers.length === 0 || prefersReducedMotion.matches) {
    return;
  }

  const progress = getScrollProgress(journeyStage);

  morphLayers.forEach((layer, index) => {
    const frame = getMorphFrame(progress, index * 0.12);

    layer.style.borderRadius = `${frame.radius[0]}% ${frame.radius[1]}% ${frame.radius[2]}% ${frame.radius[3]}% / ${frame.radius[4]}% ${frame.radius[5]}% ${frame.radius[6]}% ${frame.radius[7]}%`;
    layer.style.transform = `translate3d(${frame.x.toFixed(2)}%, ${frame.y.toFixed(2)}%, 0) rotate(${frame.rotate.toFixed(2)}deg)`;
  });
};

let ticking = false;

const requestMorphUpdate = () => {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    applyMorphStyles();
    ticking = false;
  });
};

window.addEventListener('scroll', requestMorphUpdate, { passive: true });
window.addEventListener('resize', requestMorphUpdate);
window.addEventListener('load', requestMorphUpdate);

applyMorphStyles();
