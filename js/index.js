import { Game } from "./game.js";

const board = document.getElementById("game-board");
const size = 15;

let game = null;
let loopId = null;

// ===== OVERLAY =====
const overlay = document.getElementById("game-over");
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
  cells.forEach(cell => (cell.className = "cell"));

  const head = game.snake.body[0];
  cells[head.y * size + head.x]?.classList.add("snake-head");

  game.snake.body.slice(1).forEach(seg => {
    const index = seg.y * size + seg.x;
    cells[index]?.classList.add("snake-body");
  });

  // Reverse mode: rita ETT hus
  if (game.mode === "reverse" && game.house) {
    const idx = game.house.y * size + game.house.x;
    cells[idx]?.classList.add("house");
  }

  // Classic mode: rita food
  if (game.mode === "classic" && game.food) {
    const foodIndex = game.food.y * size + game.food.x;
    cells[foodIndex]?.classList.add("food");
  }
}




// ===== INPUT =====
window.addEventListener("keydown", e => {
  if (!game || !game.running) return;

  if (e.key === "ArrowUp") game.snake.setDirection("UP");
  if (e.key === "ArrowDown") game.snake.setDirection("DOWN");
  if (e.key === "ArrowLeft") game.snake.setDirection("LEFT");
  if (e.key === "ArrowRight") game.snake.setDirection("RIGHT");
});

document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!game || !game.running) return;
    game.snake.setDirection(btn.dataset.dir);
  });
});

// ===== LEVEL SELECT (BYT LEVEL UTAN RESET) =====
document.querySelectorAll(".level-select button").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = Number(btn.dataset.level);

    document
      .querySelectorAll(".level-select button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    changeLevel(level);
  });
});

// ===== RESTART =====
restartBtn.addEventListener("click", () => {
  if (!game) return;
  startGame(game.level);
});

// ===== START =====
startBtn.addEventListener("click", () => {
  startGame(1);
});

// ===== GAME FLOW =====
function hideGameOver() {
  overlay.classList.add("hidden");
}

function showFinalResult() {
  document.getElementById("final-score").textContent = game.score;
  document.getElementById("final-packages").textContent = game.packages;
  document.getElementById("final-time").textContent = game.getElapsedTime();

  overlay.classList.remove("hidden");
}

// ===== MAIN LOOP =====
function loop() {
  if (!game.running) {
    showFinalResult();
    return;
  }

  game.update();
  draw();

  document.getElementById("score").textContent = game.score;
  document.getElementById("packages").textContent = game.packages;
  document.getElementById("time").textContent = game.getElapsedTime();

  loopId = setTimeout(loop, LEVEL_SETTINGS[game.level].speed);
}

// ===== START NEW GAME =====
function startGame(level = 1, mode = "classic") {
  if (loopId) clearTimeout(loopId);

  game = new Game(size, level, mode);

  hideGameOver();
  updateLevelLabel();
  draw();

  loop();
}


const reverseBtn = document.getElementById("reverse-btn");
reverseBtn?.addEventListener("click", () => {
  startGame(1, "reverse");
});

// ===== CHANGE LEVEL (NO RESET) =====
function changeLevel(level) {
  if (!game || !game.running) return;

  game.level = level;
  updateLevelLabel();

  if (loopId) clearTimeout(loopId);
  loop();


}
