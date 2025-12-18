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
    this.housesLeft = 0;

    this.startTime = Date.now();
    this.startDelayUntil = Date.now() + 2000; // 2 sek startpaus

    this.food = null;
    this.house = null;

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
    // ⏳ Startfördröjning
    if (Date.now() < this.startDelayUntil) return;
    if (!this.running) return;

    if (this.mode === "classic") {
      this.updateClassicFrame();
      return;
    }

    if (this.mode === "reverse") {
      this.updateReverse();
    }
  }

  /* =====================
     CLASSIC MODE
     ===================== */

  initClassic() {
    const c = Math.floor(this.size / 2);
    this.snake = new Snake(c, c);
    this.food = spawnFreePosition(this, false);

    this.housesLeft = 253;
  }

  updateClassicFrame() {
    const next = this.snake.getNextHead();

    // 🧱 Vägg
    if (
      next.x < 0 ||
      next.y < 0 ||
      next.x >= this.size ||
      next.y >= this.size
    ) {
      this.endGame("wall-crash", false);
      return;
    }

    // 📦 Kropp
    if (this.snake.occupies(next)) {
      this.endGame("self-crash", false);
      return;
    }

    // ▶️ Flytta
    this.snake.move();

    const head = this.snake.body[0];

    // 🍬 Äter paket
    if (this.food && head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;
      this.housesLeft--;
      this.score += BASE_SCORE * this.level;

      if (this.housesLeft <= 0) {
        this.endGame("classic-complete", true);
        return;
      }

      this.food = spawnFreePosition(this, false);
    }
  }

  /* =====================
     REVERSE MODE – START
     ===================== */

initReverseStart() {
  this.snake = new Snake(0, 0);

  this.snake.body = PATH.map(cell => ({ ...cell }));

  this.packages = this.snake.body.length - 2; // ← kvar i tåget
  this.housesLeft = 0;                         // ← uppätna hus

  this.reverseActive = false;
  this.reverseDirection = null;

  this.spawnHouse();
}


  /* =====================
     REVERSE MODE – UPDATE
     ===================== */

  updateReverse() {
    const next = this.snake.getNextHead();

    // 🧱 Vägg
    if (
      next.x < 0 ||
      next.y < 0 ||
      next.x >= this.size ||
      next.y >= this.size
    ) {
      this.endGame("wall-crash", false);
      return;
    }

    const hitsHouse =
      this.house &&
      next.x === this.house.x &&
      next.y === this.house.y;

    const hitsBody = this.snake.occupies(next);

    // 📦 Kropp (MEN INTE hus!)
    if (hitsBody && !hitsHouse) {
      this.endGame("self-crash", false);
      return;
    }

    // ▶️ Flytta (samma som classic)
    this.snake.move();

    const head = this.snake.body[0];

    // 🏠 Äter hus
if (this.house && head.x === this.house.x && head.y === this.house.y) {
  this.snake.removeLastPackage(); // tåget blir kortare

  this.packages--;    // 🔑 DETTA avgör när spelet är klart
  this.housesLeft++;  // 🔑 detta är "mat insamlad" i reverse

  this.score += BASE_SCORE * this.level;

  // ✅ RÄTT WIN-CONDITION
  if (this.packages <= 0) {
    this.endGame("reverse-complete", true);
    return;
  }

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
