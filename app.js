import { Game } from './Entities/Game.js'

const trainBlueWarriorsBtn = document.getElementById('trainBlueWarriors');
const trainBlueWarriorsPopup = document.querySelector('.blueWarriors');

trainBlueWarriorsBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (trainBlueWarriorsPopup.style.display === 'none') {
        trainBlueWarriorsPopup.style.display = 'flex';
    }
    else {
        trainBlueWarriorsPopup.style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
