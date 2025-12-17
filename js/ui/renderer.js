export function createGrid(board, size) {
  const cells = [];
  board.innerHTML = "";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board.appendChild(cell);
      cells.push(cell);
    }
  }
  return cells;
}

export function renderGame(cells, game, size) {
  cells.forEach(c => (c.className = "cell"));

  game.snake.body.forEach((seg, i) => {
    const idx = seg.y * size + seg.x;
    if (!cells[idx]) return;

    if (i === 0) cells[idx].classList.add("reindeer-head");
    else if (i === 1) cells[idx].classList.add("santa-body");
    else cells[idx].classList.add("snake-body");
  });

  if (game.food) {
    cells[game.food.y * size + game.food.x]
      ?.classList.add("food");
  }

  if (game.house) {
    cells[game.house.y * size + game.house.x]
      ?.classList.add("house");
  }
}
