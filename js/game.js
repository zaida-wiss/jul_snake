// js/jul_snake/game.js
import { Snake } from "./snake.js";

export class Game {
constructor(size = 15, level = 1) {
  this.size = size;
  this.level = level;
  this.score = 0;
  this.running = true;

  this.snake = new Snake(7, 7);
  this.food = this.spawnFood();
}

spawnFood() {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * this.size),
      y: Math.floor(Math.random() * this.size),
    };
  } while (this.snake.body.some(seg => seg.x === food.x && seg.y === food.y));

  return food;
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
      this.gameOver();
    }

    // Självkollision
    if (this.snake.hitsItself()) {
      this.gameOver();
    }

    // Paket taget
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.food = this.spawnFood();
      this.score += 10 * this.level;
    }
  }

gameOver() {
  this.running = false;
}
}
