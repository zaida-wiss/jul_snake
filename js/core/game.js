// core/game.js
import { Snake } from "../entities/snake.js";
import { spawnFreePosition } from "../utils/spawn.js";

/* ======================================================
   1. SPELLÄGEN & KONSTANTER
   ====================================================== */

const MODES = {
  CLASSIC: "classic",
  REVERSE: "reverse",
};

const BASE_SCORE = 5;
const CLASSIC_MAX_PACKAGES = 223;
const REVERSE_START_PACKAGES = 102;

/* ======================================================
   2. GEMENSAM SPELMOTOR (GÄLLER ALLA LÄGEN)
   ====================================================== */

export class Game {
  constructor(size, mode = MODES.CLASSIC, level = 1) {
    this.size = size;
    this.mode = mode;
    this.level = level;

    this.running = true;
    this.win = false;
    this.reason = null;

    // 🦌 Startposition enligt din bana
    this.snake = new Snake(2, 0);

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();

    // mode-specifika objekt
    this.food = null;   // classic
    this.house = null;  // reverse

    // 🔀 Initiera valt läge
    if (this.mode === MODES.CLASSIC) this.initClassic();
    if (this.mode === MODES.REVERSE) this.initReverse();

    console.log("[Game] started", {
      mode: this.mode,
      level: this.level,
      packages: this.packages,
    });
  }

  /* ================= UPDATE LOOP ================= */

  update() {
    if (!this.running) return;

    const next = this.snake.getNextHead();

    // 🚧 Kollision – gäller ALLA lägen
    if (this.isWallCollision(next) || this.isBodyCollision(next)) {
      this.endGame("crash", false);
      return;
    }

    // ✅ Flytta säkert
    this.snake.move();

    // 🔀 Lägesspecifik logik
    if (this.mode === MODES.CLASSIC) this.updateClassic();
    if (this.mode === MODES.REVERSE) this.updateReverse();
  }

  /* ================= GEMENSAMMA REGLER ================= */

  isWallCollision(p) {
    return (
      p.x < 0 ||
      p.y < 0 ||
      p.x >= this.size ||
      p.y >= this.size
    );
  }

  isBodyCollision(p) {
    const bodyWithoutTail =
      this.snake.body.length > 1
        ? this.snake.body.slice(0, -1)
        : this.snake.body;

    return bodyWithoutTail.some(
      seg => seg.x === p.x && seg.y === p.y
    );
  }

  endGame(reason, win) {
    this.running = false;
    this.win = win;
    this.reason = reason;
  }

  /* ======================================================
     3. CLASSIC MODE (ENDAST CLASSIC)
     ====================================================== */

  initClassic() {
    this.food = spawnFreePosition(this, false);
  }

  updateClassic() {
    const head = this.snake.body[0];
    if (!this.food) return;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;
      this.score += BASE_SCORE * this.level;

      console.log(
        `[Classic] +${BASE_SCORE * this.level} score (packages=${this.packages})`
      );

      // 🎉 Vinst
      if (this.packages >= CLASSIC_MAX_PACKAGES) {
        this.endGame("classic-complete", true);
        return;
      }

      this.food = spawnFreePosition(this, false);
    }
  }

  /* ======================================================
     4. REVERSE MODE (ENDAST REVERSE)
     ====================================================== */

  initReverse() {
    this.snake.buildReverseTrain(REVERSE_START_PACKAGES);
    this.packages = REVERSE_START_PACKAGES;

    // första huset: random ledig ruta
    // (spawnas även i update om null)
    // this.house = spawnFreePosition(this, false);
  }

  updateReverse() {
    const head = this.snake.body[0];

    if (!this.house) {
      // första / nästa huset
      this.house = spawnFreePosition(this, true);
      return;
    }

    if (head.x === this.house.x && head.y === this.house.y) {
      this.snake.removeLastPackage();
      this.packages--;
      this.score += BASE_SCORE * this.level;

      console.log(
        `[Reverse] house reached → packages=${this.packages}, +${BASE_SCORE * this.level}`
      );

      // 🎉 Vinst
      if (this.packages <= 0) {
        this.endGame("reverse-complete", true);
        return;
      }

      // nära i början, friare mot slutet
      const near = this.packages > 10;
      this.house = spawnFreePosition(this, near);
    }
  }

  /* ======================================================
     5. TID / HUD (GEMENSAMT)
     ====================================================== */

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
}
