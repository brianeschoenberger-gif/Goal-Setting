const journeyStage = document.getElementById('wellness-panel');
const journeyScene = document.querySelector('.scene');
const heroCard = document.querySelector('.hero-card');
const accent = document.querySelector('.accent');
const headlinePrimary = document.querySelector('.headline-primary');
const headlineScript = document.querySelector('.headline-script');
const tagline = document.querySelector('.tagline');
const contentPanel = journeyStage ? journeyStage.querySelector('.content-panel') : null;
const morphLayers = journeyStage ? journeyStage.querySelectorAll('.morph-layer') : [];
const pillarClarity = journeyStage ? journeyStage.querySelector('.pillar--clarity') : null;
const pillarBalance = journeyStage ? journeyStage.querySelector('.pillar--balance') : null;
const pillarGrowth = journeyStage ? journeyStage.querySelector('.pillar--growth') : null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;
const windowProgress = (progress, start, end) => clamp((progress - start) / (end - start), 0, 1);
const rangedLerp = (progress, start, end, from, to) => {
  if (progress <= start) {
    return from;
  }

  if (progress >= end) {
    return to;
  }

  return lerp(from, to, windowProgress(progress, start, end));
};

const KEYFRAMES = {
  intro: { start: 0, end: 0.2 },
  morphParallax: { start: 0.2, end: 0.55 },
  contentEmphasis: { start: 0.55, end: 0.85 },
  outro: { start: 0.85, end: 1 },
};

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

  const { intro, morphParallax, contentEmphasis, outro } = KEYFRAMES;
  const phase1 = windowProgress(progress, intro.start, intro.end);
  const phase2 = windowProgress(progress, morphParallax.start, morphParallax.end);
  const phase3 = windowProgress(progress, contentEmphasis.start, contentEmphasis.end);
  const phase4 = windowProgress(progress, outro.start, outro.end);

  const stageY = rangedLerp(progress, intro.start, intro.end, 132, 42)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, -46)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, -8)
    + rangedLerp(progress, outro.start, outro.end, 0, 30);
  const panelScale = rangedLerp(progress, intro.start, intro.end, 0.76, 0.94)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, 0.21)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, -0.04)
    + rangedLerp(progress, outro.start, outro.end, 0, -0.17);
  const stageBlur = rangedLerp(progress, intro.start, intro.end, 18, 3)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, -3)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, 2)
    + rangedLerp(progress, outro.start, outro.end, 0, 4);
  const stageRotate = rangedLerp(progress, intro.start, intro.end, -10, -2)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, 2)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, 2)
    + rangedLerp(progress, outro.start, outro.end, 0, 4);

  const contentY = rangedLerp(progress, intro.start, intro.end, 82, 56)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, -52)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, -26)
    + rangedLerp(progress, outro.start, outro.end, 0, 22);
  const contentOpacity = rangedLerp(progress, intro.start, intro.end, 0.04, 0.26)
    + rangedLerp(progress, morphParallax.start, morphParallax.end, 0, 0.62)
    + rangedLerp(progress, contentEmphasis.start, contentEmphasis.end, 0, 0.12)
    + rangedLerp(progress, outro.start, outro.end, 0, -0.2);

  journeyStage.style.setProperty('--p', progress.toFixed(4));
  journeyStage.style.setProperty('--phase1', phase1.toFixed(4));
  journeyStage.style.setProperty('--phase2', phase2.toFixed(4));
  journeyStage.style.setProperty('--phase3', phase3.toFixed(4));
  journeyStage.style.setProperty('--phase4', phase4.toFixed(4));
  journeyStage.style.setProperty('--stage-y', `${stageY.toFixed(2)}px`);
  journeyStage.style.setProperty('--panel-scale', panelScale.toFixed(4));
  journeyStage.style.setProperty('--stage-blur', `${stageBlur.toFixed(2)}px`);
  journeyStage.style.setProperty('--stage-rotate', `${stageRotate.toFixed(2)}deg`);
  journeyStage.style.setProperty('--content-y', `${contentY.toFixed(2)}px`);
  journeyStage.style.setProperty('--content-opacity', contentOpacity.toFixed(4));

  const layerA = getMorphFrame(rangedLerp(progress, morphParallax.start, outro.end, 0.08, 0.9), 0.08);
  const layerB = getMorphFrame(rangedLerp(progress, morphParallax.start, outro.end, 0.2, 0.96), 0.2);

  journeyStage.style.setProperty('--layerA-x', `${layerA.x.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerA-y', `${layerA.y.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerA-r', `${layerA.rotate.toFixed(2)}deg`);
  journeyStage.style.setProperty('--layerA-blur', `${rangedLerp(progress, contentEmphasis.start, outro.end, 0.4, 5.5).toFixed(2)}px`);

  journeyStage.style.setProperty('--layerB-x', `${layerB.x.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerB-y', `${layerB.y.toFixed(2)}%`);
  journeyStage.style.setProperty('--layerB-r', `${(layerB.rotate * -0.85).toFixed(2)}deg`);
  journeyStage.style.setProperty('--layerB-blur', `${rangedLerp(progress, contentEmphasis.start, outro.end, 0.2, 4).toFixed(2)}px`);

  morphLayers.forEach((layer, index) => {
    const frame = index === 0 ? layerA : layerB;
    layer.style.borderRadius = `${frame.radius[0]}% ${frame.radius[1]}% ${frame.radius[2]}% ${frame.radius[3]}% / ${frame.radius[4]}% ${frame.radius[5]}% ${frame.radius[6]}% ${frame.radius[7]}%`;
  });

  const pillarA = rangedLerp(progress, morphParallax.start, contentEmphasis.end, 0, 1);
  const pillarB = rangedLerp(progress, morphParallax.start + 0.08, contentEmphasis.end + 0.03, 0, 1);
  const pillarC = rangedLerp(progress, morphParallax.start + 0.16, outro.start + 0.02, 0, 1);
  journeyStage.style.setProperty('--pillar1-y', `${lerp(36, -16, pillarA).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar2-y', `${lerp(44, -8, pillarB).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar3-y', `${lerp(52, 0, pillarC).toFixed(2)}px`);
  journeyStage.style.setProperty('--pillar1-o', lerp(0.16, 1, pillarA).toFixed(3));
  journeyStage.style.setProperty('--pillar2-o', lerp(0.14, 1, pillarB).toFixed(3));
  journeyStage.style.setProperty('--pillar3-o', lerp(0.12, 1, pillarC).toFixed(3));

  const spotlightA = clamp(1 - Math.abs(windowProgress(progress, 0.56, 0.66) - 0.5) * 2, 0, 1);
  const spotlightB = clamp(1 - Math.abs(windowProgress(progress, 0.65, 0.75) - 0.5) * 2, 0, 1);
  const spotlightC = clamp(1 - Math.abs(windowProgress(progress, 0.74, 0.84) - 0.5) * 2, 0, 1);

  journeyStage.style.setProperty('--pillar1-scale', lerp(1, 1.12, spotlightA).toFixed(3));
  journeyStage.style.setProperty('--pillar2-scale', lerp(1, 1.12, spotlightB).toFixed(3));
  journeyStage.style.setProperty('--pillar3-scale', lerp(1, 1.12, spotlightC).toFixed(3));
  journeyStage.style.setProperty('--pillar1-spotlight', spotlightA.toFixed(3));
  journeyStage.style.setProperty('--pillar2-spotlight', spotlightB.toFixed(3));
  journeyStage.style.setProperty('--pillar3-spotlight', spotlightC.toFixed(3));

  journeyStage.style.setProperty('--goals-card-y', `${rangedLerp(progress, morphParallax.start, outro.start, 48, -22).toFixed(2)}px`);
  journeyStage.style.setProperty('--week-card-y', `${rangedLerp(progress, morphParallax.start, outro.start, 54, -12).toFixed(2)}px`);
  journeyStage.style.setProperty('--focus-card-y', `${rangedLerp(progress, contentEmphasis.start, outro.end, 64, -4).toFixed(2)}px`);
  journeyStage.style.setProperty('--float-opacity', rangedLerp(progress, morphParallax.start, outro.start, 0.08, 1).toFixed(3));

  journeyStage.style.setProperty('--orb-a-x', `${rangedLerp(progress, contentEmphasis.start, outro.end, -36, 48).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-a-y', `${rangedLerp(progress, morphParallax.start, contentEmphasis.end, 48, -8).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-b-x', `${rangedLerp(progress, contentEmphasis.start, outro.end, 34, -52).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-b-y', `${rangedLerp(progress, morphParallax.start, contentEmphasis.end, 54, 2).toFixed(2)}px`);
  journeyStage.style.setProperty('--orb-opacity', rangedLerp(progress, morphParallax.start, outro.start, 0.12, 0.98).toFixed(3));

  [pillarClarity, pillarBalance, pillarGrowth].forEach((pillar, index) => {
    if (!pillar) {
      return;
    }

    pillar.dataset.active = Number([spotlightA, spotlightB, spotlightC][index] > 0.6).toString();
  });
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
