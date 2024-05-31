import { Game } from "./Entities/Game.js";


const trainBlueWarriorsBtn = document.getElementById("trainBlueWarriors");
const trainBlueWarriorsPopup = document.querySelector(".blueWarriors");
const trainRedWarriorsBtn = document.getElementById("trainRedWarriors");
const trainRedWarriorsPopup = document.querySelector(".redWarriors");

function togglePopup(popup) {
  const isDisplayed = popup.style.display === "flex";
  closeAllPopups();
  if (!isDisplayed) {
    popup.style.display = "flex";
  }
}

function closeAllPopups() {
  trainBlueWarriorsPopup.style.display = "none";
  trainRedWarriorsPopup.style.display = "none";
}

trainBlueWarriorsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePopup(trainBlueWarriorsPopup);
});

trainRedWarriorsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePopup(trainRedWarriorsPopup);
});

document.addEventListener("click", (event) => {
  const isClickInsidePopup = trainBlueWarriorsPopup.contains(event.target) || trainRedWarriorsPopup.contains(event.target);
  const isClickOnButton = event.target === trainBlueWarriorsBtn || event.target === trainRedWarriorsBtn;
  
  if (!isClickInsidePopup && !isClickOnButton) {
    closeAllPopups();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
