// TUNE: Constants configuration for Editorial Preloader
const COLORS = { bg: "#E8E1D4", ink: "#2A3D2E" };
const WORDS = [
  { text: "Bonjour",  italic: false },
  { text: "Hello",    italic: true  },
  { text: "Salut",    italic: false },
  { text: "Ciao",     italic: true  },
  { text: "こんにちは",  italic: false },
  { text: "Hola",     italic: true  },
];
const WORD_HOLD_MS = 550;
const WORD_SWAP_MS = 500;
const WORD_SWAP_OVERLAP_MS = 60;
const MIN_SHOWTIME_MS = 3200;
const EXIT_WORD_OUT_MS = 400;
const EXIT_CURTAIN_MS = 1100;
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";
const CURTAIN_MODE: "translate" | "clip" = "translate";

(function() {
  const overlay = document.getElementById('loco-preloader');
  if (!overlay) return;

  if (sessionStorage.getItem("preloader_shown")) {
    overlay.remove();
    document.documentElement.removeAttribute('data-preloader');
    return;
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cornerLabels = overlay.querySelectorAll('.preloader-corner') as NodeListOf<HTMLElement>;
  
  let currentWordIdx = 0;
  let wordTimeout: ReturnType<typeof setTimeout>;
  
  let isWord1Active = true;
  const word1 = overlay.querySelector('.current-word') as HTMLElement;
  const word2 = overlay.querySelector('.next-word') as HTMLElement;

  let hasLoaded = false;
  const startTime = performance.now();

  window.addEventListener('load', () => { hasLoaded = true; });
  (window as any).__preloaderFinish = () => { hasLoaded = true; };
  if (document.readyState === 'complete') hasLoaded = true;

  // Render Loop / Swap Logic
  function scheduleNextSwap() {
    wordTimeout = setTimeout(() => {
      const elapsed = performance.now() - startTime;
      const minShow = isReducedMotion ? 800 : MIN_SHOWTIME_MS;
      
      if (hasLoaded && elapsed >= minShow) {
        beginExit();
        return;
      }
      
      if (isReducedMotion) {
        scheduleNextSwap();
        return;
      }

      // Perform swap
      const nextIdx = (currentWordIdx + 1) % WORDS.length;
      const activeEl = isWord1Active ? word1 : word2;
      const nextEl = isWord1Active ? word2 : word1;
      
      const nextWordData = WORDS[nextIdx];
      nextEl.textContent = nextWordData.text;
      if (nextWordData.italic) nextEl.classList.add('is-italic');
      else nextEl.classList.remove('is-italic');
      
      // Outgoing word
      activeEl.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-100%)' }
      ], { duration: WORD_SWAP_MS, easing: EASING, fill: 'forwards' });
      
      // Incoming word (offset)
      setTimeout(() => {
        nextEl.animate([
          { transform: 'translateY(100%)' },
          { transform: 'translateY(0)' }
        ], { duration: WORD_SWAP_MS, easing: EASING, fill: 'forwards' });
      }, WORD_SWAP_OVERLAP_MS);
      
      isWord1Active = !isWord1Active;
      currentWordIdx = nextIdx;
      
      scheduleNextSwap();
    }, WORD_HOLD_MS);
  }

  // Init first word
  if (word1 && word2) {
    const firstWordData = WORDS[0];
    word1.textContent = firstWordData.text;
    if (firstWordData.italic) word1.classList.add('is-italic');
    word2.style.transform = 'translateY(100%)';
    scheduleNextSwap();
  } else {
    // Fallback if words are missing
    scheduleNextSwap();
  }

  function beginExit() {
    clearTimeout(wordTimeout);
    sessionStorage.setItem("preloader_shown", "1");
    
    if (isReducedMotion) {
      overlay.style.transition = 'opacity 300ms ease';
      overlay.style.opacity = '0';
      setTimeout(cleanup, 300);
      return;
    }

    // Phase 1: Fade corners and slide out word
    cornerLabels.forEach(el => el.style.opacity = '0');
    
    const activeEl = isWord1Active ? word1 : word2;
    if (activeEl) {
      activeEl.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-100%)' }
      ], { duration: EXIT_WORD_OUT_MS, easing: EASING, fill: 'forwards' });
    }

    // Phase 2: Curtain wipe
    setTimeout(() => {
      document.documentElement.removeAttribute('data-preloader');
      if (CURTAIN_MODE === "translate") {
        overlay.classList.add('wipe-translate');
      } else {
        overlay.classList.add('wipe-clip');
      }
      setTimeout(cleanup, EXIT_CURTAIN_MS);
    }, EXIT_WORD_OUT_MS);
  }

  function cleanup() {
    overlay.remove();
    document.documentElement.removeAttribute('data-preloader');
  }
})();
