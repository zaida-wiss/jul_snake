// js/jul_snake/snake.js

export class Snake {
  constructor(startX, startY) {
    this.body = [
      { x: startX, y: startY }, // 🎅 tomte (huvud)
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
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

  move() {
    this.direction = this.nextDirection;
    const head = this.body[0];

    const newHead = { ...head };

    if (this.direction === "UP") newHead.y--;
    if (this.direction === "DOWN") newHead.y++;
    if (this.direction === "LEFT") newHead.x--;
    if (this.direction === "RIGHT") newHead.x++;

    this.body.unshift(newHead);
    this.body.pop();
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  hitsItself() {
    const [head, ...rest] = this.body;
    return rest.some(seg => seg.x === head.x && seg.y === head.y);
  }
}
