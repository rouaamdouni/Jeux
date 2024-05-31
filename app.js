import { Game } from './Entities/Game.js'

const trainBlueWarriorsBtn = document.getElementById('trainBlueWarriors');
const trainBlueWarriorsPopup = document.querySelector('.blueWarriors');
const trainRedWarriorsBtn = document.getElementById('trainRedWarriors');
const trainRedWarriorsPopup = document.querySelector('.redWarriors');


function openPopup(element){
    if (element.style.display === 'none') {
        element.style.display = 'flex';
    }
    else {
        element.style.display = 'none';
    }
}

function closePopup(element){
    element.style.display = 'none';
}

trainBlueWarriorsBtn.addEventListener('click', (event) => {
    if(!event.target.matches('.trainBlueWarriors')){
        openPopup(trainBlueWarriorsPopup);
        closePopup(trainRedWarriorsPopup);
    }

});

trainRedWarriorsBtn.addEventListener('click', (event) => {
    if(!event.target.matches('.trainRedWarriors')){
        openPopup(trainRedWarriorsPopup);
        closePopup(trainBlueWarriorsPopup);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
