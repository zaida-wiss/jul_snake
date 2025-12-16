import { Game } from "./game.js";

const board = document.getElementById("game-board");
const size = 15;

let game = null;
let loopId = null;

const overlay = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");

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


// ===== LEVEL SELECT =====
document.querySelectorAll(".level-select button").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = Number(btn.dataset.level);

    document.querySelectorAll(".level-select button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    startGame(level);
  });
});

// ===== RESTART =====
restartBtn.addEventListener("click", () => {
  startGame(game.level);
});

// ===== START =====
startBtn.addEventListener("click", () => {
  startGame(1);
});


document.querySelectorAll(".level-select button").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = Number(btn.dataset.level);

    document.querySelectorAll(".level-select button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    startGame(level); // ⭐ START
  });
});

function hideGameOver() {
  overlay.classList.add("hidden");
}

function showFinalResult() {
  document.getElementById("final-score").textContent = game.score;
  document.getElementById("final-packages").textContent = game.packages;
  document.getElementById("final-time").textContent = game.getElapsedTime();

  overlay.classList.remove("hidden");
}

function startGame(level = 1) {
  if (loopId) clearTimeout(loopId);

  game = new Game(size, level);

  hideGameOver();
  updateLevelLabel();

  draw();

  function loop() {
    if (!game.running) {
      showFinalResult();
      return;
    }

    game.update();
    draw();

    // ⭐ 🎁 ⏱️ HUD
    document.getElementById("score").textContent = game.score;
    document.getElementById("packages").textContent = game.packages;
    document.getElementById("time").textContent = game.getElapsedTime();

    loopId = setTimeout(loop, LEVEL_SETTINGS[game.level].speed);
  }

  loop();
}
