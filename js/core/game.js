// core/game.js
import { Snake } from "../entities/snake.js";
import { PATH } from "./path.js";
import { spawnFreePosition } from "../utils/spawn.js";

/* =====================
   KONSTANTER
   ===================== */

const BASE_SCORE = 5;
const CLASSIC_MAX_PACKAGES = 223;

/* =====================
   GAME
   ===================== */

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

    // används endast i reverse
    this.pathIndex = null;

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
      this.snake.move();
      this.updateClassic();
      return;
    }

if (this.mode === "reverse") {
  // 🔒 Reverse får INTE röra sig när hela PATH är fylld
  // Rörelse aktiveras först när ett paket ska bort
  return;
}
  }

  /* =====================
     CLASSIC MODE (ORÖRD)
     ===================== */

  initClassic() {
    this.snake = new Snake(0, 2);
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
     REVERSE MODE – START
     ===================== */

  initReverseStart() {
    this.snake = new Snake(0, 0);

    // 🧭 PATH-definition:
    // PATH[0] = 1 (ren)
    // PATH[1] = 2 (tomte)
    // PATH[2..] = paket

    this.snake.body = PATH.map(cell => ({ ...cell }));

    this.packages = this.snake.body.length - 2;

    // Startindex = sista paketet (högsta talet)
    this.pathIndex = PATH.length - 1;

    // Inget hus ännu
    this.house = null;
  }

  /* =====================
     REVERSE MODE – UPDATE
     ===================== */

  updateReverse() {
    const nextIndex = this.pathIndex - 1;

    // Slut på path
    if (nextIndex < 0) {
      this.endGame("reverse-complete", true);
      return;
    }

    const nextCell = PATH[nextIndex];
    if (!nextCell) {
      this.endGame("no-more-path", false);
      return;
    }

    // 🔥 KOLLISION MED EGEN KROPP
    if (this.snake.occupies(nextCell)) {
      this.endGame("self-crash", false);
      return;
    }

    // 🔥 KOLLISION MED VÄGG (säkerhet)
    if (
      nextCell.x < 0 ||
      nextCell.y < 0 ||
      nextCell.x >= this.size ||
      nextCell.y >= this.size
    ) {
      this.endGame("wall-crash", false);
      return;
    }

    // Flytta huvudet längs PATH
    this.snake.body.unshift({ ...nextCell });
    this.snake.body.pop();

    this.pathIndex = nextIndex;
  }

  /* =====================
     AVSLUT / HUD
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
