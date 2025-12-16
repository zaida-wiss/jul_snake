// js/jul_snake/game.js
import { Snake } from "./snake.js";

export class Game {
  constructor(size, level = 1) {
    this.size = size;
    this.level = level;

    this.snake = new Snake(size);
    this.food = this.spawnFood();

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();
    this.running = true;
  }

  getElapsedTime() {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  spawnFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * this.size),
        y: Math.floor(Math.random() * this.size),
      };
    } while (
      this.snake.body.some(
        seg => seg.x === food.x && seg.y === food.y
      )
    );
    return food;
  }

  update() {
    if (!this.running) return;

    const nextHead = this.snake.getNextHead();

    // 🧱 Väggkollision – stoppa INNAN rörelse
    if (
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.size ||
      nextHead.y >= this.size
    ) {
      this.running = false;
      return;
    }

    this.snake.move();

    // 💥 Självkollision
    if (this.snake.hitsItself()) {
      this.running = false;
      return;
    }

    // 🎁 Paket
    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.food = this.spawnFood();
      this.packages++;
      this.score += 10 * this.level;
    }
  }
}

