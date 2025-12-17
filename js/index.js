import { Game } from "./core/game.js";
import { createGrid, renderGame } from "./ui/renderer.js";
import { updateHUD, showGameOver, hideGameOver } from "./ui/hud.js";
import { initControls } from "./input/controls.js";

/* ---------- CONFIG ---------- */

const board = document.getElementById("game-board");
const BOARD_SIZE = 15;

const LEVEL_SPEED = {
  1: 900,
  2: 700,
  3: 550,
  4: 350,
  5: 120,
};

/* ---------- STATE ---------- */

let loopId = null;
let currentLevel = 1;
let currentMode = "classic";

// gameRef används av controls.js
const gameRef = { current: null };

// grid
const cells = createGrid(board, BOARD_SIZE);

/* ---------- GAME LOOP ---------- */

function gameLoop() {
  const game = gameRef.current;
  if (!game) return;

  if (!game.running) {
    console.warn("[Index] GAME OVER");
    showGameOver(game);
    return;
  }

  game.update();
  renderGame(cells, game, BOARD_SIZE);
  updateHUD(game);

  loopId = setTimeout(gameLoop, LEVEL_SPEED[currentLevel]);
}

/* ---------- START / RESTART ---------- */

function startGame(mode = currentMode) {
  console.log("[Index] startGame:", mode);

  hideGameOver();

  currentMode = mode;

  if (loopId) clearTimeout(loopId);

  gameRef.current = new Game(BOARD_SIZE, mode, currentLevel);


  renderGame(cells, gameRef.current, BOARD_SIZE);
  updateHUD(gameRef.current);

  gameLoop();
}

/* ---------- LEVEL CHANGE ---------- */

function changeLevel(level) {
  currentLevel = level;
  console.log("[Index] changeLevel:", level);

  if (gameRef.current) {
    gameRef.current.level = level; // 🔑 KRITISKT
  }

  if (loopId) clearTimeout(loopId);
  gameLoop();
}

/* ---------- INIT ---------- */

initControls(gameRef, startGame, changeLevel);

console.log("[Index] ready");
