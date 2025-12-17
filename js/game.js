import { Snake } from "./snake.js";

export class Game {
  constructor(size, level = 1, mode = "classic") {
    this.size = size;
    this.level = level;
    this.mode = mode;
    this.running = true;

    this.snake = new Snake(size);

    this.score = 0;
    this.startTime = Date.now();

    // 🎁 MODE SETUP
    if (this.mode === "reverse") {
      const START_PACKAGES = 42;

      this.snake.buildReverseTrain(START_PACKAGES);
      this.packages = START_PACKAGES;

      console.log("[Reverse] Start packages:", this.packages);
      this.spawnHouse(true);
    } else {
      this.packages = 0;
      this.spawnFood();
    }
  }

  update() {
    if (!this.running) return;

    const nextHead = this.snake.getNextHead();

    // 🚧 WALL COLLISION
    if (
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.size ||
      nextHead.y >= this.size
    ) {
      console.error("[Game] WALL COLLISION", nextHead);
      this.running = false;
      return;
    }

    // 🚆 BODY COLLISION
    const bodyWithoutTail = this.snake.body.slice(0, -1);
    if (bodyWithoutTail.some(seg => seg.x === nextHead.x && seg.y === nextHead.y)) {
      console.error("[Game] BODY COLLISION", nextHead);
      this.running = false;
      return;
    }

    // ✅ SAFE MOVE
    this.snake.move();

    if (this.mode === "classic") this.checkFood();
    if (this.mode === "reverse") this.checkHouse();
  }

  /* ---------- CLASSIC ---------- */

  checkFood() {
    if (!this.food) return;

    const head = this.snake.body[0];

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;

      const BASE_SCORE = 10;
      this.score += BASE_SCORE * this.level;

      console.log(`[Classic] +${BASE_SCORE * this.level} (level ${this.level})`);

      this.spawnFood();
    }
  }

  spawnFood() {
    this.food = this.getFreePosition();
    console.log("[Game] spawn food:", this.food);
  }

  /* ---------- REVERSE ---------- */

  checkHouse() {
    if (!this.house) return;

    const head = this.snake.body[0];

    if (head.x === this.house.x && head.y === this.house.y) {
      this.snake.removeLastPackage();
      this.packages--;

      const BASE_SCORE = 10;
      this.score += BASE_SCORE * this.level;

      console.log(`[Reverse] +${BASE_SCORE * this.level} (level ${this.level})`);

      if (this.packages <= 0) {
        console.log("[Reverse] ALL PACKAGES SAVED 🎉");
        this.running = false;
        this.win = true;
        return;
      }

      this.spawnHouse(this.packages > 10);
    }
  }

  spawnHouse(nearHead = false) {
    this.house = this.getFreePosition(nearHead);
    console.log("[Game] spawn house:", this.house);
  }

  /* ---------- HELPERS ---------- */

  getFreePosition(nearHead = false) {
    let pos;
    const head = this.snake.body[0];

    do {
      pos = nearHead
        ? {
            x: Math.max(0, Math.min(this.size - 1, head.x + rand(-3, 3))),
            y: Math.max(0, Math.min(this.size - 1, head.y + rand(-3, 3))),
          }
        : {
            x: Math.floor(Math.random() * this.size),
            y: Math.floor(Math.random() * this.size),
          };
    } while (this.snake.occupies(pos));

    return pos;
  }

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
