export function initControls(gameRef, onStart, onLevelChange) {
  window.addEventListener("keydown", e => {
    const map = {
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
    };
    if (map[e.key] && gameRef.current) {
      gameRef.current.snake.setDirection(map[e.key]);
    }
  });

  document.querySelectorAll(".level-select button").forEach(btn => {
    btn.onclick = () => {
      const lvl = Number(btn.dataset.level);
      onLevelChange(lvl);
    };
  });

  document.getElementById("start-btn").onclick = () => onStart("classic");
  document.getElementById("reverse-btn").onclick = () => onStart("reverse");

  document.getElementById("restart-btn").onclick = () => {
    if (gameRef.current) {
      onStart(gameRef.current.mode);
    }
  };
}
