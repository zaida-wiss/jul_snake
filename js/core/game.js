import { Snake } from "../entities/snake.js";
import { PATH } from "./path.js";
import { spawnFreePosition } from "../utils/spawn.js";

const BASE_SCORE = 5;
const CLASSIC_MAX_PACKAGES = 223;

export class Game {
  constructor(size, mode = "classic", level = 1) {
    this.size = size;
    this.mode = mode;
    this.level = level;

    this.running = true;
    this.win = false;
    this.reason = null;

    this.score = 0;
    this.packages = 0;
    this.startTime = Date.now();

    this.food = null;
    this.house = null;

    if (this.mode === "reverse") {
      this.initReverseStart();
    } else {
      this.initClassic();
    }
  }

  /* =====================
     UPDATE LOOP
     ===================== */

  update() {
    if (!this.running) return;

    const next = this.snake.getNextHead();

    if (this.isWallCollision(next) || this.isBodyCollision(next)) {
      this.endGame("crash", false);
      return;
    }

    this.snake.move();

    if (this.mode === "classic") this.updateClassic();
    if (this.mode === "reverse") this.updateReverse();
  }

  /* =====================
     GEMENSAMT
     ===================== */

  isWallCollision(p) {
    return p.x < 0 || p.y < 0 || p.x >= this.size || p.y >= this.size;
  }

  isBodyCollision(p) {
    // tillåt att “gå in i tail” samma tick (klassisk snake-regel)
    const bodyWithoutTail =
      this.snake.body.length > 1 ? this.snake.body.slice(0, -1) : this.snake.body;

    return bodyWithoutTail.some(seg => seg.x === p.x && seg.y === p.y);
  }

  endGame(reason, win) {
    this.running = false;
    this.win = win;
    this.reason = reason;
  }

  /* =====================
     CLASSIC
     ===================== */

  initClassic() {
    // start i mitten-ish
    const c = Math.floor(this.size / 2);
    this.snake = new Snake(c, c);

    this.food = spawnFreePosition(this, false);
  }

  updateClassic() {
    const head = this.snake.body[0];
    if (!this.food) return;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.packages++;
      this.score += BASE_SCORE * this.level;

      if (this.packages >= CLASSIC_MAX_PACKAGES) {
        this.endGame("classic-complete", true);
        return;
      }

      this.food = spawnFreePosition(this, false);
    }
  }

  /* =====================
     REVERSE
     ===================== */

  initReverseStart() {
    // Säkerställ att PATH matchar size*size
    // (16x16 => 256)
    const totalCells = this.size * this.size;
    if (PATH.length !== totalCells) {
      this.endGame("path-size-mismatch", false);
      return;
    }

    // Exakt start-setup:
    // fyll ALLA celler utom 1 (den blir huset)
    const startPackages = totalCells - 3; // 1 ren + 1 tomte + 1 hus

    // snake startas “grid-mässigt”, men vi byter body till PATH-setup direkt
    this.snake = new Snake(0, 0);
    this.snake.buildReverseStartFromPath(startPackages);

    this.packages = startPackages;

    // enda lediga cellen = PATH[body.length]
    this.house = PATH[this.snake.body.length];
  }

  updateReverse() {
    const head = this.snake.body[0];
    if (!this.house) return;

    if (head.x === this.house.x && head.y === this.house.y) {
      this.snake.removeLastPackage();
      this.packages--;
      this.score += BASE_SCORE * this.level;

      if (this.packages <= 0) {
        this.endGame("reverse-complete", true);
        return;
      }

      // Efter start: spawn random ledig ruta
      this.house = spawnFreePosition(this, false);
    }
  }

  /* =====================
     HUD
     ===================== */

  getElapsedTime() {
    const s = Math.floor((Date.now() - this.startTime) / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
}
