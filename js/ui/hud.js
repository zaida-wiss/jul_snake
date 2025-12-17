export function updateHUD(game) {
  document.getElementById("score").textContent = game.score;
  document.getElementById("packages").textContent = game.packages;
  document.getElementById("time").textContent = game.getElapsedTime();
}

export function showGameOver(game) {
  document.getElementById("final-score").textContent = game.score;
  document.getElementById("final-packages").textContent = game.packages;
  document.getElementById("final-time").textContent = game.getElapsedTime();

  document.getElementById("game-over")
    .classList.remove("hidden");
}

export function hideGameOver() {
  document.getElementById("game-over")
    .classList.add("hidden");
}
