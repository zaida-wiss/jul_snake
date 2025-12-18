import { Game } from "./core/game.js";
import { createGrid, renderGame } from "./ui/renderer.js";
import { updateHUD, showGameOver, hideGameOver, showWin } from "./ui/hud.js";
import { initTouchControls } from "./input/controls.js";

/* ---------- CONFIG ---------- */

const board = document.getElementById("game-board");
const BOARD_SIZE = 16;
const cells = createGrid(board, BOARD_SIZE);

// 🔑 ENDA källan till spelet
const gameRef = { current: null };

let loopId = null;
let currentLevel = 1;
let currentMode = "classic";

const LEVEL_SPEED = {
  1: 900,
  2: 700,
  3: 500,
  4: 300,
  5: 100,
};

console.log("[Index] ready");

/* ---------- GAME LOOP ---------- */

function gameLoop() {
  const game = gameRef.current;
  if (!game) return;

  if (!game.running) {
    console.warn("[Index] GAME STOPPED", {
      win: game.win,
      reason: game.reason,
    });

    if (game.win) showWin(game);
    else showGameOver(game);
    return;
  }

  game.update();
  renderGame(cells, game, BOARD_SIZE);
  updateHUD(game);

  loopId = setTimeout(gameLoop, LEVEL_SPEED[currentLevel]);
}

/* ---------- MODE & LEVEL UI ---------- */

function setActiveModeButton(mode) {
  document
    .querySelectorAll("#mode-buttons button")
    .forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
}

function setActiveLevelButton(level) {
  document
    .querySelectorAll(".level-select button")
    .forEach(btn => {
      btn.classList.toggle(
        "active",
        Number(btn.dataset.level) === level
      );
    });
}

/* ---------- START / MODE ---------- */

function startGame(mode = currentMode) {
  console.log("[Index] startGame:", mode);

  hideGameOver();
  currentMode = mode;

  if (loopId) clearTimeout(loopId);

  gameRef.current = new Game(BOARD_SIZE, mode, currentLevel);

  setActiveModeButton(mode);
  setActiveLevelButton(currentLevel);

  gameLoop();
}

/* ---------- LEVEL ---------- */

function changeLevel(level) {
  currentLevel = level;
  console.log("[Index] changeLevel:", level);

  if (gameRef.current) {
    gameRef.current.level = level;
  }

  setActiveLevelButton(level);

  if (loopId) clearTimeout(loopId);
  gameLoop();
}

/* ---------- TOUCH CONTROLS ---------- */

initTouchControls(direction => {
  const game = gameRef.current;
  if (!game || !game.running) return;

  // Samma styrning i classic & reverse
  game.snake.setDirection(direction);
});

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

/* ---------- INIT STATE ---------- */

setActiveModeButton(currentMode);
setActiveLevelButton(currentLevel);
