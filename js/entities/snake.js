import { PATH } from "../core/path.js";

export class Snake {
  constructor(startX, startY) {
    // Grid-baserad start (classic & reverse efter start)
    this.body = [
      { x: startX, y: startY },       // 🦌
      { x: startX - 1, y: startY },   // 🎅 (till höger-start)
    ];

    this.direction = "RIGHT";
    this.nextDirection = "RIGHT";
  }

  /* =====================
     INPUT / STYRNING
     ===================== */

  setDirection(dir) {
    const opposites = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (dir !== opposites[this.direction]) {
      this.nextDirection = dir;
    }
  }

  /* =====================
     GRID-RÖRELSE (styrd)
     ===================== */

  getNextHead() {
    const head = this.body[0];
    const moves = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };

    return {
      x: head.x + moves[this.nextDirection].x,
      y: head.y + moves[this.nextDirection].y,
    };
  }

  move() {
    this.direction = this.nextDirection;
    this.body.unshift(this.getNextHead());
    this.body.pop();
  }

  /* =====================
     CLASSIC
     ===================== */

  grow() {
    this.body.push({ ...this.body[this.body.length - 1] });
  }

  /* =====================
     REVERSE
     ===================== */

  removeLastPackage() {
    if (this.body.length > 2) this.body.pop();
  }

  // Exakt start-setup: kroppen ligger redan slingrad enligt PATH (pilarna)
  // Renhuvud = PATH[0], Tomte = PATH[1], paket = PATH[2...]
  buildReverseStartFromPath(packageCount) {
    const totalLength = 2 + packageCount;

    this.body = PATH.slice(0, totalLength).map(p => ({ ...p }));

    // Sätt riktning så att input-opposites funkar rimligt
    // (renhuvudet är alltid överst i din setup)
    this.direction = "RIGHT";
    this.nextDirection = "RIGHT";
  }

  occupies(pos) {
    return this.body.some(s => s.x === pos.x && s.y === pos.y);
  }
}
