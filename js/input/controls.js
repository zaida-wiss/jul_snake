// js/input/controls.js
// Kontinuerlig touch-/pointerstyrning för Snake
// Byggd för mobil (ingen scroll / zoom)

export function initTouchControls(onDirection, element = document.getElementById("game-board")) {
  if (!element) {
    console.warn("[Touch] game-board not found, falling back to document");
    element = document;
  }

  let active = false;
  let lastX = 0;
  let lastY = 0;
  let lastDirection = null;

  const DEADZONE = 10; // px – mindre = känsligare

  /* ---------- POINTER DOWN ---------- */
  element.addEventListener(
    "pointerdown",
    e => {
      // Stoppa scroll / zoom
      e.preventDefault();

      // Ignorera mus – detta är touchstyrning
      if (e.pointerType === "mouse") return;

      active = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastDirection = null;

      // Fånga pekaren så vi inte tappar touch
      try {
        element.setPointerCapture(e.pointerId);
      } catch {
        // Safari kan kasta här – ofarligt
      }

      console.log("[Touch] start", lastX, lastY);
    },
    { passive: false }
  );

  /* ---------- POINTER MOVE ---------- */
  element.addEventListener(
    "pointermove",
    e => {
      if (!active) return;

      // Stoppa scroll / zoom
      e.preventDefault();

      if (e.pointerType === "mouse") return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      // För små rörelser → ignorera
      if (Math.abs(dx) < DEADZONE && Math.abs(dy) < DEADZONE) return;

      let direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        direction = dy > 0 ? "DOWN" : "UP";
      }

      // Skicka bara om riktningen ändrats
      if (direction !== lastDirection) {
        console.log("[Touch] direction:", direction);
        onDirection(direction);
        lastDirection = direction;
      }

      // 🔑 Reset så man kan fortsätta svepa utan att släppa
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
