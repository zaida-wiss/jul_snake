import { Game } from "./game.js";

const board = document.getElementById("game-board");
const size = 15;
let game = new Game(size);

const overlay = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// ===== LEVEL SETTINGS =====
const LEVEL_SETTINGS = {
  1: { speed: 950, multiplier: 1 },
  2: { speed: 720, multiplier: 2 },
  3: { speed: 580, multiplier: 3 },
  4: { speed: 350, multiplier: 4 },
  5: { speed: 120, multiplier: 5 },
};

// ===== GRID =====
const cells = [];
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
    cells.push(cell);
  }
}

// ===== UI =====
function updateLevelLabel() {
  document.querySelector(".level-select span").textContent =
    `Level: ${game.level} (speed ${LEVEL_SETTINGS[game.level].speed} ms)`;
  document.getElementById("packages").textContent = game.packages;
}

// ===== DRAW =====
function draw() {
  cells.forEach(cell => cell.className = "cell");

  const head = game.snake.body[0];
  cells[head.y * size + head.x]?.classList.add("snake-head");

  game.snake.body.slice(1).forEach(seg => {
    const index = seg.y * size + seg.x;
    cells[index]?.classList.add("snake-body");
  });

  const foodIndex = game.food.y * size + game.food.x;
  cells[foodIndex]?.classList.add("food");
}

// ===== INPUT =====
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") game.snake.setDirection("UP");
  if (e.key === "ArrowDown") game.snake.setDirection("DOWN");
  if (e.key === "ArrowLeft") game.snake.setDirection("LEFT");
  if (e.key === "ArrowRight") game.snake.setDirection("RIGHT");
});

document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    game.snake.setDirection(btn.dataset.dir);
  });
});

// ===== GAME LOOP =====
let currentTimeoutId = null;


function gameLoop() {
  if (!game.running) return;

  game.update();
  draw();


  // 🔴 LIVE HUD
  document.getElementById("score").textContent = game.score;
  document.getElementById("packages").textContent = game.packages;
  document.getElementById("time").textContent = game.getElapsedTime();

  if (!game.running) {
    setTimeout(showFinalResult, 300);
    return;
  }

  const speed = LEVEL_SETTINGS[game.level].speed;
  currentTimeoutId = setTimeout(gameLoop, speed);
}


// ===== LEVEL SELECT =====
document.querySelectorAll(".level-select button").forEach(btn => {
  btn.addEventListener("click", () => {
    game.level = Number(btn.dataset.level);
    updateLevelLabel();

    document.querySelectorAll(".level-select button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
      gameLoop();
    }
  });
});

// ===== RESTART =====
restartBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");

  game = new Game(size, game.level); // startTime & counters reset
  updateLevelLabel();
  draw();
  gameLoop();
});

// ===== START =====
updateLevelLabel();
draw();
gameLoop();
