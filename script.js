const journeyStage = document.getElementById('wellness-panel');
const journeyScene = document.querySelector('.scene');
const heroCard = document.querySelector('.hero-card');
const accent = document.querySelector('.accent');
const headlinePrimary = document.querySelector('.headline-primary');
const headlineScript = document.querySelector('.headline-script');
const tagline = document.querySelector('.tagline');
const contentPanel = journeyStage ? journeyStage.querySelector('.content-panel') : null;
const morphLayers = journeyStage ? journeyStage.querySelectorAll('.morph-layer') : [];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;
const windowProgress = (progress, start, end) => clamp((progress - start) / (end - start), 0, 1);

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
      lerp(38, 64, phase),
      lerp(64, 36, phase),
      lerp(65, 38, phase),
      lerp(35, 62, phase),
      lerp(58, 34, phase),
      lerp(40, 66, phase),
      lerp(61, 34, phase),
      lerp(40, 66, phase),
    ],
    x: lerp(-7.5, 7.5, phase),
    y: lerp(6, -6, phase),
    rotate: lerp(-9, 9, phase),
  };
};

const setHeroStyles = (progress) => {
  const heroEase = clamp(progress * 1.2, 0, 1);

  if (heroCard) {
    heroCard.style.transform = `translate3d(0, ${lerp(0, -28, heroEase).toFixed(2)}px, 0)`;
    heroCard.style.opacity = lerp(1, 0.68, heroEase).toFixed(3);
  }

  if (accent) {
    accent.style.transform = `translate3d(0, ${lerp(0, -16, heroEase).toFixed(2)}px, 0) scale(${lerp(1, 0.92, heroEase).toFixed(3)})`;
    accent.style.opacity = lerp(1, 0.62, heroEase).toFixed(3);
  }

  if (headlinePrimary) {
    headlinePrimary.style.transform = `translate3d(0, ${lerp(0, -34, heroEase).toFixed(2)}px, 0) scale(${lerp(1, 0.9, heroEase).toFixed(3)})`;
    headlinePrimary.style.opacity = lerp(1, 0.46, heroEase).toFixed(3);
  }

  if (headlineScript) {
    headlineScript.style.transform = `translate3d(0, ${lerp(0, -24, heroEase).toFixed(2)}px, 0) rotate(${lerp(0, -2, heroEase).toFixed(2)}deg)`;
    headlineScript.style.opacity = lerp(1, 0.5, heroEase).toFixed(3);
  }

  if (tagline) {
    tagline.style.transform = `translate3d(0, ${lerp(0, -20, heroEase).toFixed(2)}px, 0) scale(${lerp(1, 0.92, heroEase).toFixed(3)})`;
    tagline.style.opacity = lerp(1, 0.42, heroEase).toFixed(3);
  }
};

const setJourneyVariables = (progress) => {
  if (!journeyStage) {
    return;
  }

  const phase1 = windowProgress(progress, 0.02, 0.34);
  const phase2 = windowProgress(progress, 0.3, 0.68);
  const phase3 = windowProgress(progress, 0.64, 1);

  const stageY = lerp(120, 0, phase1);
  const panelScale = lerp(0.84, 1.14, phase2) - phase3 * 0.08;
  const stageBlur = lerp(14, 0, phase1) + phase3 * 2.8;
  const stageRotate = lerp(-8, 0, phase1) + lerp(0, 4, phase3);
  const contentY = lerp(52, -12, phase2) + lerp(0, -16, phase3);
  const contentOpacity = lerp(0.2, 1, phase2) - phase3 * 0.12;

  journeyStage.style.setProperty('--p', progress.toFixed(4));
  journeyStage.style.setProperty('--phase1', phase1.toFixed(4));
  journeyStage.style.setProperty('--phase2', phase2.toFixed(4));
  journeyStage.style.setProperty('--phase3', phase3.toFixed(4));
  journeyStage.style.setProperty('--stage-y', `${stageY.toFixed(2)}px`);
  journeyStage.style.setProperty('--panel-scale', panelScale.toFixed(4));
  journeyStage.style.setProperty('--stage-blur', `${stageBlur.toFixed(2)}px`);
  journeyStage.style.setProperty('--stage-rotate', `${stageRotate.toFixed(2)}deg`);
  journeyStage.style.setProperty('--content-y', `${contentY.toFixed(2)}px`);
  journeyStage.style.setProperty('--content-opacity', contentOpacity.toFixed(4));

  const layerA = getMorphFrame(progress, 0.08);
  const layerB = getMorphFrame(progress, 0.2);

  journeyStage.style.setProperty('--layerA-x', `${layerA.x.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerA-y', `${layerA.y.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerA-r', `${layerA.rotate.toFixed(2)}deg`);
  journeyStage.style.setProperty('--layerA-blur', `${lerp(0, 4, phase3).toFixed(2)}px`);

  journeyStage.style.setProperty('--layerB-x', `${layerB.x.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerB-y', `${layerB.y.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerB-r', `${(layerB.rotate * -0.85).toFixed(2)}deg`);
  journeyStage.style.setProperty('--layerB-blur', `${lerp(0, 3, phase3).toFixed(2)}px`);

  morphLayers.forEach((layer, index) => {
    const frame = index === 0 ? layerA : layerB;
    layer.style.borderRadius = `${frame.radius[0]}% ${frame.radius[1]}% ${frame.radius[2]}% ${frame.radius[3]}% / ${frame.radius[4]}% ${frame.radius[5]}% ${frame.radius[6]}% ${frame.radius[7]}%`;
  });

  const [pillarA = 0, pillarB = 0, pillarC = 0] = Array.from({ length: 3 }, (_, index) => windowProgress(progress, 0.24 + index * 0.09, 0.64 + index * 0.09));
  journeyStage.style.setProperty('--pillar1-y', `${lerp(28, -18, pillarA).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar2-y', `${lerp(34, -10, pillarB).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar3-y', `${lerp(40, -2, pillarC).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar1-o', lerp(0.22, 1, pillarA).toFixed(3));
  journeyStage.style.setProperty('--pillar2-o', lerp(0.2, 1, pillarB).toFixed(3));
  journeyStage.style.setProperty('--pillar3-o', lerp(0.18, 1, pillarC).toFixed(3));

  journeyStage.style.setProperty('--goals-card-y', `${lerp(38, -22, phase2).toFixed(2)}px`);
  journeyStage.style.setProperty('--week-card-y', `${lerp(44, -12, phase2).toFixed(2)}px`);
  journeyStage.style.setProperty('--focus-card-y', `${lerp(58, 0, phase3).toFixed(2)}px`);
  journeyStage.style.setProperty('--float-opacity', lerp(0.16, 1, phase2).toFixed(3));

  journeyStage.style.setProperty('--orb-a-x', `${lerp(-30, 42, phase3).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-a-y', `${lerp(34, -8, phase2).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-b-x', `${lerp(26, -46, phase3).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-b-y', `${lerp(40, 0, phase2).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-opacity', lerp(0.2, 0.98, phase2).toFixed(3));
};

const resetForReducedMotion = () => {
  [heroCard, accent, headlinePrimary, headlineScript, tagline].forEach((element) => {
    if (!element) {
      return;
    }

    element.style.transform = 'none';
    element.style.opacity = '1';
  });

  if (journeyStage) {
    journeyStage.style.cssText = '';
  }
};

const applySceneStyles = () => {
  const progress = getSceneProgress();

  if (prefersReducedMotion.matches) {
    resetForReducedMotion();
    return;
  }

  setHeroStyles(progress);
  setJourneyVariables(progress);
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
