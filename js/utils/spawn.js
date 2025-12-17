export function spawnFreePosition(game, near = false) {
  let pos;
  const head = game.snake.body[0];

  do {
    pos = near
      ? {
          x: clamp(head.x + rand(-3, 3), 0, game.size - 1),
          y: clamp(head.y + rand(-3, 3), 0, game.size - 1),
        }
      : {
          x: Math.floor(Math.random() * game.size),
          y: Math.floor(Math.random() * game.size),
        };
  } while (game.snake.occupies(pos));

  return pos;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
