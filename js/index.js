import { Game } from "./game.js";

const board = document.getElementById("game-board");
const size = 15;

let game = null;
let loopId = null;
let currentLevel = 1;
let currentMode = "classic";

/* ---------- LEVEL SPEED ---------- */

const LEVELS = {
  1: 900,
  2: 700,
  3: 550,
  4: 350,
  5: 120,
};

console.log("[Index] loaded");

/* ---------- GRID ---------- */

const cells = [];
board.innerHTML = "";

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
    cells.push(cell);
  }
}

/* ---------- GAME LOOP ---------- */

function loop() {
  if (!game || !game.running) {
    console.warn("[Index] GAME OVER");

    document.getElementById("final-score").textContent = game.score;
    document.getElementById("final-packages").textContent = game.packages;
    document.getElementById("final-time").textContent =
      game.getElapsedTime();

    document.getElementById("game-over").classList.remove("hidden");
    return;
  }

  game.update();
  draw();
  updateHUD();

  loopId = setTimeout(loop, LEVELS[currentLevel]);
}

/* ---------- START / MODE ---------- */

function startGame(mode = currentMode) {
  console.log(
    "[Index] startGame → mode:",
    mode,
    "level:",
    currentLevel
  );

  // dölj game over-overlay
  document.getElementById("game-over").classList.add("hidden");

  currentMode = mode;

  if (loopId) clearTimeout(loopId);

  // 🔑 SKICKA LEVEL TILL GAME
  game = new Game(size, currentLevel, mode);

  loop();
}

/* ---------- LEVEL CHANGE ---------- */

function changeLevel(level) {
  currentLevel = level;
  console.log("[Index] change level:", level);

  // uppdatera pågående spel
  if (game) {
    game.level = currentLevel;
  }

  if (loopId) clearTimeout(loopId);
  loop();
}

/* ---------- DRAW ---------- */

function draw() {
  cells.forEach(c => (c.className = "cell"));

  game.snake.body.forEach((seg, i) => {
    const idx = seg.y * size + seg.x;
    if (!cells[idx]) return;

    if (i === 0) {
      cells[idx].classList.add("reindeer-head");
    } else if (i === 1) {
      cells[idx].classList.add("santa-body");
    } else {
      cells[idx].classList.add("snake-body");
    }
  });

  if (game.food) {
    cells[game.food.y * size + game.food.x]
      ?.classList.add("food");
  }

  if (game.house) {
    cells[game.house.y * size + game.house.x]
      ?.classList.add("house");
  }
}

/* ---------- HUD ---------- */

function updateHUD() {
  document.getElementById("score").textContent = game.score;
  document.getElementById("packages").textContent = game.packages;
  document.getElementById("time").textContent =
    game.getElapsedTime();
}

/* ---------- INPUT ---------- */

window.addEventListener("keydown", e => {
  if (!game) return;

  const map = {
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
  };

  if (map[e.key]) {
    console.log("[Input] key:", e.key);
    game.snake.setDirection(map[e.key]);
  }
});

/* ---------- BUTTONS ---------- */

document.querySelectorAll(".level-select button").forEach(btn => {
  btn.onclick = () =>
    changeLevel(Number(btn.dataset.level));
});

document.getElementById("start-btn").onclick = () =>
  startGame("classic");

document.getElementById("reverse-btn").onclick = () =>
  startGame("reverse");

document.getElementById("restart-btn").onclick = () => {
  console.log("[UI] Restart clicked");
  startGame(game ? game.mode : currentMode);
};
