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

    this.snake.move();
    const head = this.snake.body[0];
    if (!head) return;

    // Väggkollision
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.size ||
      head.y >= this.size
    ) {
      this.gameOver();
      return;
    }

    // Självkollision
    if (this.snake.hitsItself()) {
      this.gameOver();
      return;
    }

    // Paket taget
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.food = this.spawnFood();
      this.packages += 1;
      this.score += 10 * this.level;
    }
  }

  gameOver() {
    this.running = false;
  }
}
