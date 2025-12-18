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
    if (!this.reverseDirection) return;

    const head = this.snake.body[0];

    const dirMap = {
      UP:    { x: 0, y: -1 },
      DOWN:  { x: 0, y: 1 },
      LEFT:  { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };

    const move = dirMap[this.reverseDirection];
    const target = {
      x: head.x + move.x,
      y: head.y + move.y,
    };

    if (
      target.x < 0 ||
      target.y < 0 ||
      target.x >= this.size ||
      target.y >= this.size
    ) {
      this.endGame("wall-crash", false);
      return;
    }

    if (target.x !== this.emptyCell.x || target.y !== this.emptyCell.y) {
      this.endGame("self-crash", false);
      return;
    }

    // 🏠 Träffar huset
if (this.house &&
    target.x === this.house.x &&
    target.y === this.house.y) {

  // 1️⃣ Ta bort ett paket (svansen)
  const removed = this.snake.body.pop();

  // 2️⃣ Flytta in i huset (som är tom cell i praktiken)
  this.snake.body.unshift({ ...this.house });

  // 3️⃣ Den borttagna svansen blir ny tom ruta
  this.emptyCell = { ...removed };

  // 4️⃣ Ta bort huset och spawna nytt
  this.house = null;
  this.spawnHouse();

  return;
}

    const tail = this.snake.body[this.snake.body.length - 1];

    this.snake.body.unshift({ ...this.emptyCell });
    this.snake.body.pop();

    this.emptyCell = { ...tail };
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
