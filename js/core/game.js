// core/game.js
import { Snake } from "../entities/snake.js";
import { spawnFreePosition } from "../utils/spawn.js";

const CLASSIC_MAX_PACKAGES = 223;
const BASE_SCORE = 5;

export class Game {
  constructor(size, mode = "classic", level = 1) {
    this.size = size;
    this.mode = mode;
    this.level = level;

    this.running = true;
    this.win = false;
    this.reason = null;

    this.snake = new Snake(size);

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();

    this.food = null;
    this.house = null;

    if (this.mode === "reverse") {
      const START_PACKAGES = 102;
      this.snake.buildReverseTrain(START_PACKAGES);
      this.packages = START_PACKAGES;

      this.house = spawnFreePosition(this, false);  👈 nära huvudet: av/på
    } else {
      // classic
      this.food = spawnFreePosition(this, false);
    }

    console.log("[Game] started", {
      mode: this.mode,
      level: this.level,
      packages: this.packages,
    });
  }

  /* ================= UPDATE ================= */

  update() {
    if (!this.running) return;

    const next = this.snake.getNextHead();

    // 🚧 Vägg eller svans = GAME OVER
    if (this.isWallCollision(next) || this.isBodyCollision(next)) {
      console.warn("[Game] crash");
      this.running = false;
      this.win = false;
      this.reason = "crash";
      return;
    }

    // ✅ Säkert att flytta
    this.snake.move();

    if (this.mode === "classic") this.checkFood();
    if (this.mode === "reverse") this.checkHouse();
  }

  /* ================= COLLISIONS ================= */

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

  /* ================= CLASSIC ================= */

  checkFood() {
    const head = this.snake.body[0];
    if (!this.food) return;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;
      this.score += BASE_SCORE * this.level;

      console.log(
        `[Classic] +${BASE_SCORE * this.level} score (packages=${this.packages})`
      );

      // 🎉 CLASSIC WIN
      if (this.packages >= CLASSIC_MAX_PACKAGES) {
        this.running = false;
        this.win = true;
        this.reason = "classic-complete";
        return;
      }

      this.food = spawnFreePosition(this, false);
    }
  }

  /* ================= REVERSE ================= */

  checkHouse() {
    const head = this.snake.body[0];
    if (!this.house) {
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


      // 🎉 REVERSE WIN
      if (this.packages <= 0) {
        this.running = false;
        this.win = true;
        this.reason = "reverse-complete";
        return;
      }

      const near = this.packages > 10;
      this.house = spawnFreePosition(this, near);
    }
  }

  /* ================= TIME ================= */

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;
  }
}
