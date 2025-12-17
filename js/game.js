import { Snake } from "./snake.js";

export class Game {
  constructor(size, mode = "classic") {
    this.size = size;
    this.mode = mode;
    this.running = true;

    this.snake = new Snake(size);

    this.score = 0;
    this.startTime = Date.now();
    this.packages = this.snake.body.length - 2;

    this.food = null;
    this.house = null;

    console.log(`[Game] started. Mode=${mode}`);

    if (mode === "classic") {
      this.spawnFood();
    } else {
      this.spawnHouse(true);
    }
  }

  update() {
    if (!this.running) return;

    this.snake.move();
    const head = this.snake.body[0];

    // Väggkollision
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.size ||
      head.y >= this.size
    ) {
      console.error("[Game] WALL COLLISION");
      this.running = false;
      return;
    }

    // Kroppskollision
    if (this.snake.isSelfCollision()) {
      console.error("[Game] BODY COLLISION");
      this.running = false;
      return;
    }

    if (this.mode === "classic") {
      this.checkFood();
    } else {
      this.checkHouse();
    }
  }

  /* ---------- CLASSIC ---------- */

  checkFood() {
    const h = this.snake.body[0];
    if (!this.food) return;

    if (h.x === this.food.x && h.y === this.food.y) {
      console.log("[Game] FOOD EATEN");
      this.snake.grow();
      this.packages++;
      this.score += 10;
      this.spawnFood();
    }
  }

  spawnFood() {
    this.food = this.getFreePosition();
    console.log("[Game] spawn food:", this.food);
  }

  /* ---------- REVERSE ---------- */

  checkHouse() {
    const h = this.snake.body[0];
    if (!this.house) return;

    if (h.x === this.house.x && h.y === this.house.y) {
      console.log("[Game] HOUSE HIT");
      this.snake.shrink();
      this.packages = this.snake.body.length - 2;

      if (this.packages <= 0) {
        console.warn("[Game] NO PACKAGES LEFT → GAME OVER");
        this.running = false;
        return;
      }

      const near = this.packages <= 10;
      this.house = this.getFreePosition(near);
      console.log("[Game] new house:", this.house, "nearHead:", near);
    }
  }

  spawnHouse(near) {
    this.house = this.getFreePosition(near);
    console.log("[Game] spawn house:", this.house, "nearHead:", near);
  }

  /* ---------- HELPERS ---------- */

  getFreePosition(nearHead = false) {
    let pos;
    const head = this.snake.body[0];

    do {
      if (nearHead) {
        pos = {
          x: Math.max(0, Math.min(this.size - 1, head.x + rand(-3, 3))),
          y: Math.max(0, Math.min(this.size - 1, head.y + rand(-3, 3))),
        };
      } else {
        pos = {
          x: Math.floor(Math.random() * this.size),
          y: Math.floor(Math.random() * this.size),
        };
      }
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
