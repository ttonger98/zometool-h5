const heroImages = [
  'assets/detail-landscape.jpg',
  'assets/build-step-3.jpg',
  'assets/build-step-4.jpg'
];

const buildSteps = [
  {
    image: 'assets/build-clean-3.png',
    pieces: [
      { name: '白球', count: 3, kind: 'ball' },
      { name: '蓝色中棍', count: 3, kind: 'rod-blue' }
    ]
  },
  {
    image: 'assets/build-clean-1.png',
    pieces: [
      { name: '白球', count: 3, kind: 'ball' },
      { name: '红色短棍', count: 6, kind: 'rod-red' }
    ]
  },
  {
    image: 'assets/build-clean-2.png',
    pieces: [
      { name: '白球', count: 1, kind: 'ball' },
      { name: '蓝色中棍', count: 3, kind: 'rod-blue' }
    ]
  },
  {
    image: 'assets/build-clean-4.png',
    pieces: [
      { name: '白球', count: 3, kind: 'ball' },
      { name: '红色短棍', count: 3, kind: 'rod-red' }
    ]
  }
];

const heroSurface = document.getElementById('heroSurface');
const heroImage = document.getElementById('heroImage');
const heroViewer = document.getElementById('heroViewer');
const startBuildButton = document.getElementById('startBuildButton');
const buildView = document.getElementById('buildView');
const exitBuildButton = document.getElementById('exitBuildButton');
const resetViewButton = document.getElementById('resetViewButton');
const buildImage = document.getElementById('buildImage');
const partsCard = document.getElementById('partsCard');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const prevStepButton = document.getElementById('prevStepButton');
const nextStepButton = document.getElementById('nextStepButton');
const replayButton = document.getElementById('replayButton');
const completionSheet = document.getElementById('completionSheet');
const downloadModal = document.getElementById('downloadModal');
const partsModal = document.getElementById('partsModal');
const partsToggleBtn = document.getElementById('partsToggleBtn');

let heroIndex = 0;
let currentStep = 0;
let pointerStartX = null;

const renderHeroImage = () => {
  heroImage.style.opacity = '0.4';
  setTimeout(() => {
    heroImage.src = heroImages[heroIndex];
    heroImage.style.opacity = '1';
  }, 110);
};

const setHeroTilt = (clientX, clientY) => {
  const rect = heroViewer.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width - 0.5;
  const y = (clientY - rect.top) / rect.height - 0.5;
  heroViewer.style.setProperty('--tilt-y', `${x * 14}deg`);
  heroViewer.style.setProperty('--tilt-x', `${-y * 12}deg`);
  heroViewer.style.setProperty('--scale', '1.02');
};

const resetHeroTilt = () => {
  heroViewer.style.setProperty('--tilt-y', '0deg');
  heroViewer.style.setProperty('--tilt-x', '0deg');
  heroViewer.style.setProperty('--scale', '1');
};

heroSurface.addEventListener('pointermove', (event) => setHeroTilt(event.clientX, event.clientY));
heroSurface.addEventListener('pointerleave', resetHeroTilt);
heroSurface.addEventListener('pointerdown', (event) => {
  pointerStartX = event.clientX;
});
heroSurface.addEventListener('pointerup', (event) => {
  if (pointerStartX === null) return;
  const delta = event.clientX - pointerStartX;
  if (Math.abs(delta) > 24) {
    heroIndex = delta < 0 ? (heroIndex + 1) % heroImages.length : (heroIndex - 1 + heroImages.length) % heroImages.length;
    renderHeroImage();
  }
  pointerStartX = null;
});

const renderBuildStep = () => {
  const step = buildSteps[currentStep];
  buildImage.src = step.image;
  partsCard.innerHTML = step.pieces
    .map(
      (piece) => `
        <div class="parts-card__row parts-card__row--inline ${piece.kind === 'rod-red' ? 'parts-card__row--red' : ''} ${piece.kind === 'rod-blue' ? 'parts-card__row--blue' : ''}">
          <span class="parts-card__name">${piece.name}</span>
          <strong>x${piece.count}</strong>
          <span class="parts-card__icon parts-card__icon--${piece.kind}"></span>
        </div>
      `
    )
    .join('');

  const ratio = (currentStep + 1) / buildSteps.length;
  progressFill.style.width = `${ratio * 100}%`;
  progressText.textContent = `${currentStep + 1}/${buildSteps.length}`;
  document.documentElement.style.setProperty('--progress-left', `${ratio * 100}%`);
  prevStepButton.disabled = currentStep === 0;
  prevStepButton.style.opacity = currentStep === 0 ? '0.45' : '1';
};

const openBuildView = () => {
  buildView.classList.remove('hidden');
  buildView.setAttribute('aria-hidden', 'false');
  completionSheet.classList.add('hidden');
  completionSheet.setAttribute('aria-hidden', 'true');
  document.body.classList.add('build-open');
  currentStep = 0;
  renderBuildStep();
};

const closeBuildView = () => {
  buildView.classList.add('hidden');
  buildView.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('build-open');
};

startBuildButton.addEventListener('click', openBuildView);
exitBuildButton.addEventListener('click', closeBuildView);
resetViewButton.addEventListener('click', () => {
  buildImage.src = buildSteps[currentStep].image;
});

prevStepButton.addEventListener('click', () => {
  if (currentStep === 0) return;
  currentStep -= 1;
  renderBuildStep();
});

nextStepButton.addEventListener('click', () => {
  if (currentStep < buildSteps.length - 1) {
    currentStep += 1;
    renderBuildStep();
    return;
  }
  completionSheet.classList.remove('hidden');
  completionSheet.setAttribute('aria-hidden', 'false');
});

replayButton.addEventListener('click', () => {
  completionSheet.classList.add('hidden');
  completionSheet.setAttribute('aria-hidden', 'true');
  currentStep = 0;
  renderBuildStep();
});

document.querySelectorAll('[data-foldable]').forEach((block) => {
  const body = block.querySelector('.foldable__body');
  const trigger = block.querySelector('[data-toggle-fold]');
  trigger.addEventListener('click', () => {
    const collapsed = body.classList.toggle('foldable__body--collapsed');
    if (body.classList.contains('parts-list')) {
      body.classList.toggle('parts-list--collapsed');
    }
    trigger.textContent = collapsed ? '展开查看全部' : '收起';
  });
});

const openDownloadModal = () => {
  downloadModal.classList.remove('hidden');
  downloadModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closeDownloadModal = () => {
  downloadModal.classList.add('hidden');
  downloadModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

const openPartsModal = () => {
  partsModal.classList.remove('hidden');
  partsModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closePartsModal = () => {
  partsModal.classList.add('hidden');
  partsModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('[data-download-trigger]').forEach((node) => {
  node.addEventListener('click', openDownloadModal);
});

document.querySelectorAll('[data-close-modal]').forEach((node) => {
  node.addEventListener('click', closeDownloadModal);
});

partsToggleBtn.addEventListener('click', openPartsModal);

document.querySelectorAll('[data-close-parts]').forEach((node) => {
  node.addEventListener('click', closePartsModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDownloadModal();
    closePartsModal();
    if (!buildView.classList.contains('hidden')) {
      closeBuildView();
    }
  }
});

renderBuildStep();
