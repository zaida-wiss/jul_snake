// input/controls.js
// =====================================
// Touch-input
// - Anropar callback(direction)
// - Index.js avgör vad som händer sen
// =====================================

let startX = null;
let startY = null;

const SWIPE_THRESHOLD = 20;

export function initTouchControls(onDirection) {
  const canvas = document.getElementById("game-board");

  if (!canvas) {
    console.warn("[Controls] game-board not found");
    return;
  }

  canvas.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      if (startX === null || startY === null) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      startX = null;
      startY = null;

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

      // 🔑 Skicka riktningen till index.js
      onDirection(direction);
    },
    { passive: true }
  );
}
