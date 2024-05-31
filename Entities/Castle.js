import { Nain } from './Nain.js';
import { Elfe } from './Elfe.js';
import { ChefNain } from './ChefNain.js';
import { ChefElfe } from './ChefElfe.js';


export class Castle {
    constructor(color) {
        this.color = color;
        this.resources = 3;
        this.queue = [];
        this.trainingArea = document.querySelector(`.${color}TrainingPhase`);
        this.resourceDisplay = document.querySelector(`.${color}Ressources`);

        console.log('resources', this.resourceDisplay);
        this.initialize();
    }

    initialize() {
        this.updateResourceDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector(`.${this.color}-Nain`).addEventListener('click', () => this.trainWarrior('Nain'));
        document.querySelector(`.${this.color}-ChefNain`).addEventListener('click', () => this.trainWarrior('ChefNain'));
        document.querySelector(`.${this.color}-Elfe`).addEventListener('click', () => this.trainWarrior('Elfe'));
        document.querySelector(`.${this.color}-ChefElfe`).addEventListener('click', () => this.trainWarrior('ChefElfe'));
    }

    trainWarrior(type) {



        const warriorCost = { Nain: 1, ChefNain: 3, Elfe: 2, ChefElfe: 4 };
        if (this.resources >= warriorCost[type]) {
            let warrior;
            const name = `${type} ${this.queue.length + 1}`;
            switch (type) {
                case 'Nain':
                    warrior = new Nain(name);
                    break;
                case 'ChefNain':
                    warrior = new ChefNain(name);
                    break;
                case 'Elfe':
                    warrior = new Elfe(name);
                    break;
                case 'ChefElfe':
                    warrior = new ChefElfe(name);
                    break;
            }
            this.queue.push(warrior);
            this.resources -= warriorCost[type];
            this.updateResourceDisplay();
            this.displayWarrior(warrior);
        } else {
            alert('Not enough resources!');
        }
    }

    updateResourceDisplay() {
        this.resourceDisplay.innerHTML = `Resources: ${this.resources}`;
    }

    displayWarrior(warrior) {
        const warriorDiv = document.createElement('div');
        warriorDiv.classList.add(`${warrior.name.split(' ')[0].toLowerCase()}Div`, `${this.color}Warrior`);
        warriorDiv.classList.add(`${this.color}Div`);
        warriorDiv.innerHTML = `
            <p>${warrior.name} | </p>
            <p>Health: ${warrior.healthPoints} HP</p>`;
        this.trainingArea.appendChild(warriorDiv);
    }
}

