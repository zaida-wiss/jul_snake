export class Snake {
  constructor(size) {
    const c = Math.floor(size / 2);

    // 🦌 Ren → 🎅 Tomte → 🎁 Paket
    this.body = [
      { x: c, y: c },
      { x: c - 1, y: c },
      { x: c - 2, y: c },
    ];

    this.direction = "RIGHT";
    this.nextDirection = "RIGHT";

    console.log("[Snake] init body:", this.body);
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
      console.log("[Snake] direction set to:", dir);
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
  const next = this.getNextHead();
  this.body.unshift(next);
  this.body.pop();
}

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
    console.log("[Snake] grew. Length:", this.body.length);
  }

  shrink() {
    if (this.body.length > 2) {
      this.body.pop();
      console.log("[Snake] shrink. Length:", this.body.length);
    }
  }

  isSelfCollision() {
    const [head, ...rest] = this.body;
    const hit = rest.some(s => s.x === head.x && s.y === head.y);
    if (hit) console.warn("[Snake] SELF COLLISION");
    return hit;
  }

  occupies(pos) {
    return this.body.some(s => s.x === pos.x && s.y === pos.y);
  }
}
