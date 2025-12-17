// controls.js
export function initTouchControls(onDirection) {
  let startX = 0;
  let startY = 0;

  document.addEventListener(
    "touchstart",
    e => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        onDirection(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        onDirection(dy > 0 ? "DOWN" : "UP");
      }
    },
    { passive: true }
  );
}
