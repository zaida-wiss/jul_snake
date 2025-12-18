// input/controls.js
// =====================================
// Touch-input (LIVE-styrning)
// - Anropar callback(direction)
// - Direction uppdateras under drag
// =====================================

let startX = null;
let startY = null;
let lastDirection = null;

const SWIPE_THRESHOLD = 10; // lägre = snabbare respons

export function initTouchControls(onDirection) {
  const canvas = document.getElementById("game-board");
  if (!canvas) return;

  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    lastDirection = null;
  }, { passive: true });

  canvas.addEventListener("touchmove", e => {
    if (startX === null || startY === null) return;

    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

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

    // 🔑 Skicka bara om riktningen ändrats
    if (direction !== lastDirection) {
      onDirection(direction);
      lastDirection = direction;
    }

    // flytta referenspunkten → mjuk styrning
    startX = t.clientX;
    startY = t.clientY;

  }, { passive: true });

  canvas.addEventListener("touchend", () => {
    startX = null;
    startY = null;
    lastDirection = null;
  }, { passive: true });
}
