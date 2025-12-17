export class Snake {
  constructor(size) {
    const c = Math.floor(size / 2);

    this.body = [
      { x: c, y: c },       // 🦌 Ren
      { x: c - 1, y: c },   // 🎅 Tomte
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

  grow() {
    this.body.push({ ...this.body[this.body.length - 1] });
  }

  removeLastPackage() {
    if (this.body.length > 2) this.body.pop();
  }

  buildReverseTrain(count) {
    const head = this.body[0];
    this.body = [
      { x: head.x, y: head.y },
      { x: head.x - 1, y: head.y },
    ];
    for (let i = 0; i < count; i++) {
      this.body.push({ x: head.x - 2 - i, y: head.y });
    }
  }

  occupies(pos) {
    return this.body.some(s => s.x === pos.x && s.y === pos.y);
  }
}
