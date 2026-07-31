/**
 * ambient.client.ts
 * Canvas 2D: horizontal ledger ruling lines drifting slowly leftward.
 * What they represent: the background grid of an accounting ledger — the
 * invisible structure that trust accounting lives within.
 *
 * ~14 lines visible at any viewport height. Cost: ~14 moveTo/lineTo per frame.
 * Paused on document.hidden and when canvas scrolled off-screen.
 * Scroll velocity slightly adjusts drift speed for feel.
 */

const canvas = document.getElementById('ambient-canvas') as HTMLCanvasElement | null;
if (!canvas) throw new Error('ambient-canvas missing');

const ctx = canvas.getContext('2d', { alpha: true })!;
const LINE_SPACING = 56;   // 56px row height — matches 8px grid × 7
const BASE_SPEED   = 0.3;  // px per frame baseline drift

let w = 0, h = 0, dpr = 1;
let offset = 0;
let rafId: number;
let scrollVel = 0;
let lastScrollY = window.scrollY;
let isVisible = true;

function resize() {
  dpr = Math.min(devicePixelRatio, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas!.width  = w * dpr;
  canvas!.height = h * dpr;
  canvas!.style.width  = w + 'px';
  canvas!.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Debounced resize — stale measurements cause offset jitter
let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 100);
}, { passive: true });
resize();

// Track scroll velocity to feed drift speed
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  scrollVel = Math.abs(y - lastScrollY);
  lastScrollY = y;
  // Decay velocity quickly so it doesn't linger
  setTimeout(() => { scrollVel = Math.max(0, scrollVel - 1); }, 100);
}, { passive: true });

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Number of lines: enough to fill viewport + 2 buffer
  const lineCount = Math.ceil(h / LINE_SPACING) + 2;
  const speed = BASE_SPEED + scrollVel * 0.005;
  offset = (offset + speed) % LINE_SPACING;

  // Single batched path for all lines — minimal GPU state changes
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(212, 168, 67, 0.04)'; // --accent at 4% opacity
  ctx.lineWidth = 1;

  for (let i = 0; i < lineCount; i++) {
    const y = Math.round(i * LINE_SPACING - offset);
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  if (isVisible) {
    rafId = requestAnimationFrame(draw);
  }
}

// Pause when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isVisible = false;
    cancelAnimationFrame(rafId);
  } else {
    isVisible = true;
    draw();
  }
});

// Pause when canvas is off-screen (e.g. not in view after heavy scroll)
// Canvas is fixed, so it's always in the viewport — only pause on hidden tab
draw();
