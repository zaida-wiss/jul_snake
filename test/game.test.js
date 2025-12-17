import { Game } from "../js/game.js";

test("Game.update stoppar spelet vid väggkollision", () => {
  const game = new Game(5, 1);

  // Placera ormens huvud i vänsterkant
  game.snake.body = [{ x: 0, y: 2 }];
  game.snake.direction = "LEFT";
  game.snake.nextDirection = "LEFT";

  // Kör ett tick
  game.update();

  // Förväntat beteende
  expect(game.running).toBe(false);
});

test("Game.update ger poäng och paket när maten äts", () => {
  const game = new Game(5, 2); // level 2

  // Placera maten rakt framför ormen
  const head = game.snake.body[0];
  game.food = { x: head.x + 1, y: head.y };
  game.snake.nextDirection = "RIGHT";

  game.update();

  expect(game.packages).toBe(1);
  expect(game.score).toBe(20); // 10 * level
});
