// input/controls.js
// =====================================
// Touch-input
// - Styrning sker under pågående finger-rörelse
// - Ingen scroll / zoom
// - Samma beteende i classic & reverse
// =====================================

let startX = null;
let startY = null;
let lastDirection = null;

const SWIPE_THRESHOLD = 12; // lägre = snabbare respons

export function initTouchControls(onDirection) {
  const touchZone =
    document.getElementById("touch-zone") ||
    document.getElementById("game-board");

  if (!touchZone) {
    console.warn("[Controls] touch zone not found");
    return;
  }

  function reset() {
    startX = null;
    startY = null;
    lastDirection = null;
  }

  touchZone.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastDirection = null;
    },
    { passive: false }
  );

  touchZone.addEventListener(
    "touchmove",
    (e) => {
      if (startX === null || startY === null) return;

      e.preventDefault(); // 🔒 stoppa scroll/zoom

      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (
        Math.abs(dx) < SWIPE_THRESHOLD &&
        Math.abs(dy) < SWIPE_THRESHOLD
      ) {
        return;
      }

      let direction;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        direction = dy > 0 ? "DOWN" : "UP";
      }

      // 🔒 Skicka bara om riktningen faktiskt ändras
   if (direction !== lastDirection) {
  lastDirection = direction;
  onDirection(direction);

  // 🔑 reset referenspunkt så riktningen inte flippar
  startX = touch.clientX;
  startY = touch.clientY;
}
    },
    { passive: false }
  );

  touchZone.addEventListener(
    "touchend",
    reset,
    { passive: true }
  );

  touchZone.addEventListener(
    "touchcancel",
    reset,
    { passive: true }
  );
}
