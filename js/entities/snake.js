export class Snake {

  /* ======================================================
     1. START / GRUNDLÄGE (GÄLLER ALLA LÄGEN)
     ====================================================== */

  constructor(startX, startY) {
    this.body = [
      { x: startX, y: startY },       // 🦌 Ren (huvud)
      { x: startX - 1, y: startY },   // 🎅 Tomte (första segment)
    ];

    this.direction = "RIGHT";
    this.nextDirection = "RIGHT";
  }

  /* ======================================================
     2. GEMENSAM RÖRELSE & STYRNING
     ====================================================== */

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
      UP:    { x: 0,  y: -1 },
      DOWN:  { x: 0,  y: 1 },
      LEFT:  { x: -1, y: 0 },
      RIGHT: { x: 1,  y: 0 },
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

  /* ======================================================
     3. CLASSIC MODE (TILLVÄXT)
     ====================================================== */

  grow() {
    this.body.push({ ...this.body[this.body.length - 1] });
  }

  /* ======================================================
     4. REVERSE MODE (BAKÅT-TÅG)
     ====================================================== */

  removeLastPackage() {
    if (this.body.length > 2) {
      this.body.pop();
    }
  }

  buildReverseTrain(count) {
    const head = this.body[0];

    // ⚠️ OBS:
    // Denna logik bygger rakt bakåt i X-led.
    // Om du kör bana/path måste detta ersättas
    // med path-baserad uppbyggnad.
    this.body = [
      { x: head.x, y: head.y },
      { x: head.x - 1, y: head.y },
    ];

    for (let i = 0; i < count; i++) {
      this.body.push({
        x: head.x - 2 - i,
        y: head.y,
      });
    }
  }

  /* ======================================================
     5. HJÄLPFUNKTIONER (GEMENSAMT)
     ====================================================== */

  occupies(pos) {
    return this.body.some(
      seg => seg.x === pos.x && seg.y === pos.y
    );
  }
}
