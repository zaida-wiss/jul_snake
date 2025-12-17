// js/jul_snake/game.js
import { Snake } from "./snake.js";

export class Game {
  constructor(size, level = 1, mode = "classic") {
    this.size = size;
    this.level = level;
    this.mode = mode; // "classic" | "reverse"

    this.snake = new Snake(size);

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();
    this.running = true;

    // reverse-mode state
    this.house = null;

    if (this.mode === "reverse") {
      this.setupReverseMode();
    } else {
      this.food = this.spawnFood();
    }
  }

setupReverseMode() {
  const cx = Math.floor(this.size / 2);
  const cy = Math.floor(this.size / 2);

  const body = [];

  // 🦌 Renen – HUVUDET
  body.push({ x: cx, y: cy, type: "reindeer" });

  // 🎅 Tomten – alltid efter renen
  body.push({ x: cx - 1, y: cy, type: "santa" });

  // 🎁 Paketen
  for (let i = 0; i < this.size * this.size - 4; i++) {
    body.push({
      x: cx - 2 - i,
      y: cy,
      type: "package",
    });
  }

  this.snake.setBody(body);

  // endast paket räknas
  this.packages = body.filter(s => s.type === "package").length;

  // ett hus
  this.house = this.spawnHouse();
}


  createNearlyFullSnakeBody() {
    // Serpentin-fyllning: rad 0 vänster->höger, rad 1 höger->vänster, osv.
    // Vi lämnar sista cellen tom: (size-1, size-1)
    const body = [];
    for (let y = 0; y < this.size; y++) {
      if (y % 2 === 0) {
        for (let x = 0; x < this.size; x++) {
          if (x === this.size - 1 && y === this.size - 1) continue;
          body.push({ x, y });
        }
      } else {
        for (let x = this.size - 1; x >= 0; x--) {
          if (x === this.size - 1 && y === this.size - 1) continue;
          body.push({ x, y });
        }
      }
    }
    // body[0] blir head, resten blir paket
    return body;
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
    } while (this.snake.body.some(seg => seg.x === food.x && seg.y === food.y));
    return food;
  }

  spawnHouse() {
    let house;
    do {
      house = {
        x: Math.floor(Math.random() * this.size),
        y: Math.floor(Math.random() * this.size),
      };
    } while (
      this.snake.body.some(seg => seg.x === house.x && seg.y === house.y)
    );
    return house;
  }

  update() {
    if (!this.running) return;

    const nextHead = this.snake.getNextHead();

    // Väggkollision = game over (du kan ändra till "stanna" om du vill)
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

    // Självkollision
    if (this.snake.hitsItself()) {
      this.running = false;
      return;
    }

    const head = this.snake.body[0];

// ===== REVERSE MODE =====
if (this.mode === "reverse") {
  const head = this.snake.body[0];

  if (head.x === this.house.x && head.y === this.house.y) {
    // ta bort ett paket
    if (this.snake.body.length > 1) {
      this.snake.shrink();
      this.packages--;
    }

    // win condition
    if (this.packages <= 0) {
      this.running = false;
      return;
    }

    // spawn nytt hus
    this.house = this.spawnHouse();
  }

  return;
}

    // ===== CLASSIC MODE (som du har idag) =====
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.food = this.spawnFood();
      this.packages++;
      this.score += 10 * this.level;
    }
  }
}
