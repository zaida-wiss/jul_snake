// core/game.js
import { Snake } from "../entities/snake.js";
import { PATH } from "./path.js";
import { spawnFreePosition } from "../utils/spawn.js";

const BASE_SCORE = 5;
const CLASSIC_MAX_PACKAGES = 223;

export class Game {
  constructor(size, mode = "classic", level = 1) {
    this.size = size;
    this.mode = mode;
    this.level = level;

    this.running = true;
    this.win = false;
    this.reason = null;

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();

    this.food = null;
    this.house = null;

    this.reverseActive = false;
    this.reverseDirection = null;
    this.shrinkPending = 0;

    if (this.mode === "reverse") {
      this.initReverseStart();
    } else {
      this.initClassic();
    }
  }

  /* =====================
     UPDATE LOOP
     ===================== */

  update() {
    if (!this.running) return;

    if (this.mode === "classic") {
      const next = this.snake.getNextHead();

      if (
        next.x < 0 ||
        next.y < 0 ||
        next.x >= this.size ||
        next.y >= this.size
      ) {
        this.endGame("wall-crash", false);
        return;
      }

      this.snake.move();
      this.updateClassic();
      return;
    }

    if (this.mode === "reverse") {
      if (!this.reverseActive) return;
      this.updateReverse();
    }
  }

  /* =====================
     CLASSIC
     ===================== */

  initClassic() {
    const c = Math.floor(this.size / 2);
    this.snake = new Snake(c, c);
    this.food = spawnFreePosition(this, false);
  }

  updateClassic() {
    const head = this.snake.body[0];
    if (!this.food) return;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;
      this.score += BASE_SCORE * this.level;

      if (this.packages >= CLASSIC_MAX_PACKAGES) {
        this.endGame("classic-complete", true);
        return;
      }

      this.food = spawnFreePosition(this, false);
    }
  }

  /* =====================
     REVERSE – START
     ===================== */

  initReverseStart() {
    this.snake = new Snake(0, 0);

    // Fyll tåget (1–255)
    this.snake.body = PATH.map(cell => ({ ...cell }));
    this.packages = this.snake.body.length - 2;

    // Tom ruta (256)
    this.emptyCell = { x: 3, y: 0 };

    this.reverseActive = false;
    this.reverseDirection = null;

    // 🏠 Spawn house korrekt
    this.spawnHouse();
  }

  /* =====================
     REVERSE – UPDATE
     ===================== */

updateReverse() {
  const next = this.snake.getNextHead();

  // 🧱 Väggkollision (SAME AS CLASSIC)
  if (
    next.x < 0 ||
    next.y < 0 ||
    next.x >= this.size ||
    next.y >= this.size
  ) {
    this.endGame("wall-crash", false);
    return;
  }

  // 📦 Kroppskollision (SAME AS CLASSIC)
  if (this.snake.occupies(next)) {
    this.endGame("self-crash", false);
    return;
  }

  // ▶️ Flytta (SAME AS CLASSIC)
  this.snake.move();

  const head = this.snake.body[0];

  // 🏠 Äter hus → krymp bakifrån
  if (
    this.house &&
    head.x === this.house.x &&
    head.y === this.house.y
  ) {
    this.snake.removeLastPackage();
    this.packages--;
    this.score += BASE_SCORE * this.level;

    this.house = null;
    this.spawnHouse();
  }
}




  /* =====================
     HOUSE HELPERS
     ===================== */

  getAllEmptyCells() {
    const occupied = new Set(
      this.snake.body.map(p => `${p.x},${p.y}`)
    );

    const empty = [];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) {
          empty.push({ x, y });
        }
      }
    }

    return empty;
  }

spawnHouse() {
  // I reverse är enda tomrutan emptyCell (i början),
  // och senare kan fler tomrutor uppstå när tåget krymper.
  const emptyCells = this.getAllEmptyCells();

  if (emptyCells.length === 0) return;

  const index = Math.floor(Math.random() * emptyCells.length);
  this.house = emptyCells[index];
}



  /* =====================
     AVSLUT
     ===================== */

  endGame(reason, win) {
    this.running = false;
    this.win = win;
    this.reason = reason;
  }

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
}
