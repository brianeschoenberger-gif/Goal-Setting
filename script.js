const journeyStage = document.getElementById('wellness-panel');
const journeyScene = document.querySelector('.scene');
const heroCard = document.querySelector('.hero-card');
const accent = document.querySelector('.accent');
const contentPanel = journeyStage ? journeyStage.querySelector('.content-panel') : null;
const pillars = contentPanel ? contentPanel.querySelectorAll('.pillar') : [];
const morphLayers = journeyStage ? journeyStage.querySelectorAll('.morph-layer') : [];
const floatingPanels = journeyStage ? journeyStage.querySelectorAll('.floating-panel') : [];
const orbs = journeyStage ? journeyStage.querySelectorAll('.orb') : [];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

const getSceneProgress = () => {
  if (!journeyScene) {
    return 0;
  }

  const rect = journeyScene.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const totalScroll = Math.max(rect.height - viewportHeight, 1);
  const sceneScroll = clamp(-rect.top, 0, totalScroll);

  return sceneScroll / totalScroll;
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

const applySceneStyles = () => {
  const progress = getSceneProgress();

  if (prefersReducedMotion.matches) {
    if (heroCard) {
      heroCard.style.transform = 'none';
      heroCard.style.opacity = '1';
    }
    if (accent) {
      accent.style.transform = 'none';
      accent.style.opacity = '1';
    }
    if (journeyStage) {
      journeyStage.style.transform = 'none';
      journeyStage.style.opacity = '1';
      journeyStage.style.filter = 'none';
    }
    if (contentPanel) {
      contentPanel.style.transform = 'none';
      contentPanel.style.opacity = '1';
    }
    pillars.forEach((pillar) => {
      pillar.style.transform = 'none';
      pillar.style.opacity = '1';
    });
    floatingPanels.forEach((panel) => {
      panel.style.transform = 'none';
      panel.style.opacity = '1';
    });
    orbs.forEach((orb) => {
      orb.style.transform = 'none';
      orb.style.opacity = '1';
    });
    return;
  }

  const heroEase = clamp(progress * 1.15, 0, 1);
  const stageEase = clamp((progress - 0.06) / 0.88, 0, 1);

  if (heroCard) {
    heroCard.style.transform = `translate3d(0, ${lerp(0, -16, heroEase).toFixed(2)}px, 0)`;
    heroCard.style.opacity = lerp(1, 0.72, heroEase).toFixed(3);
  }

  if (accent) {
    accent.style.transform = `translate3d(0, ${lerp(0, -10, heroEase).toFixed(2)}px, 0) scale(${lerp(1, 0.96, heroEase).toFixed(3)})`;
    accent.style.opacity = lerp(1, 0.74, heroEase).toFixed(3);
  }

  if (journeyStage) {
    journeyStage.style.transform = `translate3d(0, ${lerp(76, 0, stageEase).toFixed(2)}px, 0) scale(${lerp(0.92, 1, stageEase).toFixed(3)})`;
    journeyStage.style.opacity = lerp(0.08, 1, stageEase).toFixed(3);
    journeyStage.style.filter = `blur(${lerp(5, 0, stageEase).toFixed(2)}px)`;
  }

  if (contentPanel) {
    const panelEase = clamp((progress - 0.16) / 0.74, 0, 1);
    contentPanel.style.transform = `translate3d(0, ${lerp(30, 0, panelEase).toFixed(2)}px, 0)`;
    contentPanel.style.opacity = lerp(0.35, 1, panelEase).toFixed(3);
  }

  pillars.forEach((pillar, index) => {
    const pillarEase = clamp((progress - (0.2 + index * 0.08)) / 0.62, 0, 1);
    pillar.style.transform = `translate3d(0, ${lerp(18, 0, pillarEase).toFixed(2)}px, 0)`;
    pillar.style.opacity = lerp(0.45, 1, pillarEase).toFixed(3);
  });

  morphLayers.forEach((layer, index) => {
    const frame = getMorphFrame(progress, index * 0.12);

    layer.style.borderRadius = `${frame.radius[0]}% ${frame.radius[1]}% ${frame.radius[2]}% ${frame.radius[3]}% / ${frame.radius[4]}% ${frame.radius[5]}% ${frame.radius[6]}% ${frame.radius[7]}%`;
    layer.style.transform = `translate3d(${frame.x.toFixed(2)}%, ${frame.y.toFixed(2)}%, 0) rotate(${frame.rotate.toFixed(2)}deg)`;
  });

  floatingPanels.forEach((panel, index) => {
    const panelEase = clamp((progress - (0.28 + index * 0.08)) / 0.58, 0, 1);
    panel.style.transform = `translate3d(0, ${lerp(18, 0, panelEase).toFixed(2)}px, 0)`;
    panel.style.opacity = lerp(0.2, 1, panelEase).toFixed(3);
  });

  orbs.forEach((orb, index) => {
    const orbEase = clamp((progress - 0.14) / 0.72, 0, 1);
    const drift = index === 0 ? 1 : -1;
    orb.style.transform = `translate3d(${lerp(0, drift * 10, orbEase).toFixed(2)}px, ${lerp(20, 0, orbEase).toFixed(2)}px, 0) scale(${lerp(0.9, 1, orbEase).toFixed(3)})`;
    orb.style.opacity = lerp(0.2, 0.95, orbEase).toFixed(3);
  });
};

let ticking = false;

const requestSceneUpdate = () => {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    applySceneStyles();
    ticking = false;
  });
};

window.addEventListener('scroll', requestSceneUpdate, { passive: true });
window.addEventListener('resize', requestSceneUpdate);
window.addEventListener('load', requestSceneUpdate);

prefersReducedMotion.addEventListener('change', requestSceneUpdate);

applySceneStyles();
