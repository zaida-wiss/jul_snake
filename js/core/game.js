import { Snake } from "../entities/snake.js";
import { spawnFreePosition } from "../utils/spawn.js";

export class Game {
  constructor(size, mode = "classic", level = 1) {
    this.size = size;
    this.mode = mode;
    this.level = level;

    this.running = true;
    this.win = false;

    this.snake = new Snake(size);

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();

    // init targets
    this.food = null;
    this.house = null;

    if (this.mode === "reverse") {
      const START_PACKAGES = 42;
      this.snake.buildReverseTrain(START_PACKAGES);
      this.packages = START_PACKAGES;

      // 🔑 spawn första huset på tom ruta (gärna nära)
      this.house = spawnFreePosition(this, true);
    } else {
      // classic startar med 0 paket
      this.packages = 0;

      // 🔑 spawn första maten på tom ruta
      this.food = spawnFreePosition(this, false);
    }

    console.log("[Game] started", { mode: this.mode, level: this.level });
  }

  update() {
    if (!this.running) return;

    const next = this.snake.getNextHead();

    // vägg
    if (this.isWallCollision(next)) {
      this.running = false;
      return;
    }

    // kropp (tillåt ej att gå in i kroppen)
    if (this.isBodyCollision(next)) {
      this.running = false;
      return;
    }

    // flytta först när det är säkert
    this.snake.move();

    if (this.mode === "classic") this.checkFood();
    if (this.mode === "reverse") this.checkHouse();
  }

  isWallCollision(p) {
    return p.x < 0 || p.y < 0 || p.x >= this.size || p.y >= this.size;
  }

  isBodyCollision(p) {
    // tillåt inte att gå in i kroppen (men ignorera sista segmentet som flyttar)
    const bodyWithoutTail =
      this.snake.body.length > 1 ? this.snake.body.slice(0, -1) : this.snake.body;

    return bodyWithoutTail.some(seg => seg.x === p.x && seg.y === p.y);
  }

  /* ---------- CLASSIC ---------- */

  checkFood() {
    const head = this.snake.body[0];
    if (!this.food) return;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;

      const BASE_SCORE = 5;
      this.score += BASE_SCORE * this.level;

      // ny mat på tom ruta
      this.food = spawnFreePosition(this, false);

      console.log(
        `[Classic] ate food → packages=${this.packages}, +${BASE_SCORE * this.level} score`
      );
    }
  }

  /* ---------- REVERSE ---------- */

  checkHouse() {
    const head = this.snake.body[0];
    if (!this.house) {
      this.house = spawnFreePosition(this, true);
      return;
    }

    if (head.x === this.house.x && head.y === this.house.y) {
      // ta bort paket (svansen)
      this.snake.removeLastPackage();
      this.packages--;

      const BASE_SCORE = 5;
      this.score += BASE_SCORE * this.level;

      console.log(
        `[Reverse] reached house → packages=${this.packages}, +${BASE_SCORE * this.level} score`
      );

      if (this.packages <= 0) {
        this.running = false;
        this.win = true;
        return;
      }

      // nya hus: nära i början, friare senare
      const near = this.packages > 10;
      this.house = spawnFreePosition(this, near);
    }
  }

  /* ---------- TIME ---------- */

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;
  }
}
