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

    const next = this.snake.getNextHead();

    // väggkollision
    if (
      next.x < 0 ||
      next.y < 0 ||
      next.x >= this.size ||
      next.y >= this.size
    ) {
      this.endGame("wall-crash", false);
      return;
    }

    // kroppskollision (utan svansen)
    const bodyWithoutTail = this.snake.body.slice(0, -1);
    if (bodyWithoutTail.some(s => s.x === next.x && s.y === next.y)) {
      this.endGame("self-crash", false);
      return;
    }

    this.snake.move();

    if (this.mode === "classic") this.updateClassic();
    if (this.mode === "reverse") this.updateReverse();
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

    // 🔒 Start enligt kartan:
    // PATH[1] = ruta 1 → 🦌 ren
    // PATH[2] = ruta 2 → 🎅 tomte
    this.snake.body = [
      { ...PATH[1] },
      { ...PATH[2] },
    ];

    this.snake.direction = "RIGHT";
    this.snake.nextDirection = "RIGHT";

    // Enda tomma rutan (157)
    this.house = PATH[156];
  }

  /* =====================
     REVERSE – LOOP (STUB)
     ===================== */

  updateReverse() {
    // 🔒 Medvetet tom just nu.
    // Reverse-logik byggs här senare.
  }

  /* =====================
     SLUT
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
