// js/input/controls.js
// Kontinuerlig touch-/pointerstyrning (håll & svep)

export function initTouchControls(
  onDirection,
  element = document.getElementById("game-board")
) {
  if (!element) {
    console.warn("[Touch] game-board not found");
    return;
  }

  let active = false;
  let lastX = 0;
  let lastY = 0;
  let lastDirection = null;

  const DEADZONE = 8; // px – känslighet

  /* ---------- POINTER DOWN ---------- */
  element.addEventListener(
    "pointerdown",
    e => {
      if (e.pointerType === "mouse") return;

      e.preventDefault();

      active = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastDirection = null;

      try {
        element.setPointerCapture(e.pointerId);
      } catch {}

      console.log("[Touch] start", lastX, lastY);
    },
    { passive: false }
  );

  /* ---------- POINTER MOVE ---------- */
  element.addEventListener(
    "pointermove",
    e => {
      if (!active || e.pointerType === "mouse") return;

      e.preventDefault();

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      if (Math.abs(dx) < DEADZONE && Math.abs(dy) < DEADZONE) return;

      let direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        direction = dy > 0 ? "DOWN" : "UP";
      }

      if (direction !== lastDirection) {
        console.log("[Touch] direction:", direction);
        onDirection(direction);
        lastDirection = direction;
      }

      // 🔑 gör att man kan fortsätta svepa utan att släppa
      lastX = e.clientX;
      lastY = e.clientY;
    },
    { passive: false }
  );

  /* ---------- POINTER UP / CANCEL ---------- */
  const endTouch = e => {
    if (!active) return;

    e.preventDefault();
    active = false;
    lastDirection = null;

    try {
      element.releasePointerCapture(e.pointerId);
    } catch {}

    console.log("[Touch] end");
  };

  element.addEventListener("pointerup", endTouch, { passive: false });
  element.addEventListener("pointercancel", endTouch, { passive: false });
}
