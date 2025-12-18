import { Game } from "./core/game.js";
import { createGrid, renderGame } from "./ui/renderer.js";
import { updateHUD, showGameOver, hideGameOver, showWin } from "./ui/hud.js";
import { initTouchControls } from "./input/controls.js";

/* ---------- CONFIG ---------- */

const board = document.getElementById("game-board");
const BOARD_SIZE = 16; // ✅ måste vara 16 (inte 15)
const cells = createGrid(board, BOARD_SIZE);

// 🔑 ENDA källan till spelet
const gameRef = { current: null };

let loopId = null;
let currentLevel = 1;
let currentMode = "classic";

const LEVEL_SPEED = {
  1: 900,
  2: 700,
  3: 550,
  4: 350,
  5: 120,
};

console.log("[Index] ready");

/* ---------- GAME LOOP ---------- */

function gameLoop() {
  const game = gameRef.current;
  if (!game) return;

  // 🛑 SPELET HAR STANNAT
  if (!game.running) {
    console.warn("[Index] GAME STOPPED", {
      win: game.win,
      reason: game.reason,
    });

    if (game.win) showWin(game);
    else showGameOver(game);

    return;
  }

  // ▶️ SPELET PÅGÅR
  game.update();
  renderGame(cells, game, BOARD_SIZE);
  updateHUD(game);

  loopId = setTimeout(gameLoop, LEVEL_SPEED[currentLevel]);
}

/* ---------- START / MODE ---------- */
function updateModeButtons(mode) {
  const buttons = document.querySelectorAll("#mode-buttons button");

  buttons.forEach(btn => btn.classList.remove("active"));

  if (mode === "classic") {
    document.getElementById("start-btn")?.classList.add("active");
  }

  if (mode === "reverse") {
    document.getElementById("reverse-btn")?.classList.add("active");
  }
}
function updateLevelButtons(level) {
  const buttons = document.querySelectorAll(".level-select button");

  buttons.forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.querySelector(
    `.level-select button[data-level="${level}"]`
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

function startGame(mode = currentMode) {
  console.log("[Index] startGame:", mode);

  hideGameOver();
  currentMode = mode;

  if (loopId) clearTimeout(loopId);

  gameRef.current = new Game(BOARD_SIZE, mode, currentLevel);

  // 🔑 UI-synk
  updateModeButtons(mode);
  updateLevelButtons(currentLevel);

  gameLoop();
}

/* ---------- LEVEL ---------- */

function changeLevel(level) {
  currentLevel = level;
  console.log("[Index] changeLevel:", level);

  if (gameRef.current) {
    gameRef.current.level = level;
  }

  // 🔑 uppdatera UI
  updateLevelButtons(level);

  if (loopId) clearTimeout(loopId);
  gameLoop();
}

/* ---------- TOUCH CONTROLS ---------- */

initTouchControls(direction => {
  const game = gameRef.current;
  if (!game || !game.running) return;

  // 🔑 SAMMA STYRNING I ALLA LÄGEN
  game.snake.setDirection(direction);
});
function setActiveModeButton(mode) {
  document
    .querySelectorAll("#mode-buttons button")
    .forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
}


/* ---------- UI EVENTS ---------- */

document.querySelectorAll(".level-select button").forEach(btn => {
  btn.onclick = () => changeLevel(Number(btn.dataset.level));
});

document.getElementById("start-btn").onclick = () => startGame("classic");
document.getElementById("reverse-btn").onclick = () => startGame("reverse");

document.getElementById("restart-btn").onclick = () => {
  console.log("[UI] restart");
  startGame(currentMode);
};

updateModeButtons(currentMode);
updateLevelButtons(currentLevel);