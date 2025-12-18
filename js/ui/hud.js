// ui/hud.js
// =====================================
// HUD – ansvarar ENDAST för visning
// Läser state från game, ingen logik
// =====================================

export function updateHUD(game) {
  document.getElementById("score").textContent = game.score;

  // Statistik
  document.getElementById("packages").textContent = game.packages;

  // 🔑 VIKTIGT:
  // "houses" i UI = housesLeft i spelet (båda moden)
  document.getElementById("houses").textContent = game.housesLeft;

  document.getElementById("time").textContent = game.getElapsedTime();
}

export function showGameOver(game) {
  document.getElementById("final-score").textContent = game.score;
  document.getElementById("final-packages").textContent = game.packages;

  // 🔑 Samma mapping här
  document.getElementById("final-houses").textContent = game.housesLeft;

  document.getElementById("final-time").textContent = game.getElapsedTime();

  document
    .getElementById("game-over")
    .classList.remove("hidden");
}

export function hideGameOver() {
  document
    .getElementById("game-over")
    .classList.add("hidden");
}

export function showWin(game) {
  document.getElementById("final-score").textContent = game.score;
  document.getElementById("final-packages").textContent = game.packages;

  // 🔑 Samma mapping även vid vinst
  document.getElementById("final-houses").textContent = game.housesLeft;

  document.getElementById("final-time").textContent = game.getElapsedTime();

  const title = document.querySelector("#game-over h2");
  if (title) {
    if (game.reason === "classic-complete") {
      title.textContent = "🏆 Alla paket insamlade!";
    } else if (game.reason === "reverse-complete") {
      title.textContent = "🎉 Alla hus insamlade!";
    } else {
      title.textContent = "🎅 Spelet är slut!";
    }
  }

  document
    .getElementById("game-over")
    .classList.remove("hidden");
}
