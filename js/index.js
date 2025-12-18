import { Game } from "./core/game.js";
import { createGrid, renderGame } from "./ui/renderer.js";
import { updateHUD, showGameOver, hideGameOver, showWin } from "./ui/hud.js";
import { initTouchControls } from "./input/controls.js";

/* ---------- CONFIG ---------- */

const board = document.getElementById("game-board");
const BOARD_SIZE = 16; // ✅ var 15
const cells = createGrid(board, BOARD_SIZE);

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

  if (!game.running) {
    console.warn("[Index] GAME STOPPED", { win: game.win, reason: game.reason });

    if (game.win) showWin(game);
    else showGameOver(game);

    return;
  }

  game.update();
  renderGame(cells, game, BOARD_SIZE);
  updateHUD(game);

  loopId = setTimeout(gameLoop, LEVEL_SPEED[currentLevel]);
}

/* ---------- START / MODE ---------- */

function startGame(mode = currentMode) {
  console.log("[Index] startGame:", mode);

  hideGameOver();
  currentMode = mode;

  if (loopId) clearTimeout(loopId);

  gameRef.current = new Game(BOARD_SIZE, mode, currentLevel);
  gameLoop();
}

/* ---------- LEVEL ---------- */

function changeLevel(level) {
  currentLevel = level;
  console.log("[Index] changeLevel:", level);

  if (gameRef.current) gameRef.current.level = level;

  if (loopId) clearTimeout(loopId);
  gameLoop();
}

/* ---------- TOUCH CONTROLS ---------- */

initTouchControls(direction => {
  const game = gameRef.current;
  if (!game) return;

  if (!game.running) {
    if (game.win) showWin(game);
    else showGameOver(game);
    return;
  }

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
