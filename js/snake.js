// js/jul_snake/snake.js

export class Snake {
  constructor(size) {
    const center = Math.floor(size / 2);

    this.body = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
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
    return rest.some(
      seg => seg.x === head.x && seg.y === head.y
    );
  }
}
