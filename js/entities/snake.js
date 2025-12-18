// entities/snake.js

export class Snake {
  constructor(startX, startY) {
    this.body = [
      { x: startX, y: startY },       // huvud (ren)
      { x: startX - 1, y: startY },   // svans (tomte)
    ];

    this.direction = "RIGHT";
    this.nextDirection = "RIGHT";
  }

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

  getNextHead() {
    const head = this.body[0];
    const moves = {
      UP:    { x: 0, y: -1 },
      DOWN:  { x: 0, y: 1 },
      LEFT:  { x: -1, y: 0 },
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

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  removeLastPackage() {
    if (this.body.length > 2) {
      this.body.pop();
    }
  }

  /* =====================
     🔒 KRITISK FÖR CLASSIC
     ===================== */

  occupies(pos) {
    return this.body.some(
      seg => seg.x === pos.x && seg.y === pos.y
    );
  }
}
