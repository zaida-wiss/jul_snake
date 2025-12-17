// input/controls.js

export function initTouchControls(onDirection) {
  let startX = 0;
  let startY = 0;
  let lastDirection = null;

  const DEADZONE = 20; // px – justera vid behov

  document.addEventListener(
    "touchstart",
    e => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      lastDirection = null;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    e => {
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // Ignorera små rörelser
      if (Math.abs(dx) < DEADZONE && Math.abs(dy) < DEADZONE) return;

      let direction;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        direction = dy > 0 ? "DOWN" : "UP";
      }

      // Skicka bara om riktningen ändrats
      if (direction !== lastDirection) {
        onDirection(direction);
        lastDirection = direction;

        // Reset startpunkt så man kan fortsätta dra
        startX = t.clientX;
        startY = t.clientY;
      }
    },
    { passive: true }
  );
}
