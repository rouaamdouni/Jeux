class Warrior {
    constructor(name) {
        this.name = name;
        this.force = 10;
        this.healthPoints = 100;
    }

    attack() {
        let damage = 0;
        for (let i = 0; i < this.force; i++) {
            damage += Math.floor(Math.random() * 3) + 1;
        }
        return damage;
    }

    takeDamage(damage) {
        this.healthPoints -= damage;
    }
}

class Nain extends Warrior {
    constructor(name) {
        super(name);
    }

    takeDamage(damage) {
        this.healthPoints -= damage / 2;
    }
}

class Elfe extends Warrior {
    constructor(name) {
        super(name);
        this.force = 20;
    }
}

class ChefNain extends Nain {
    constructor(name) {
        super(name);
    }
    takeDamage(damage) {
        this.healthPoints -= damage / 4;
    }
}

class ChefElfe extends Elfe {
    constructor(name) {
        super(name);
        this.force = 40;
    }
}

class Castle {
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

class Game {
    constructor() {
        this.blueCastle = new Castle('blue');
        this.redCastle = new Castle('red');
        this.board = Array.from({ length: 5 }, () => ({ blue: [], red: [] }));
        this.setupGameControls();
        this.renderBoard();
    }

    setupGameControls() {
        document.querySelector('.startGame').addEventListener('click', () => this.startGame());
        document.querySelector('.startTour').addEventListener('click', () => this.startTour());
    }

    startGame() {
        this.resetGame();
        console.log('Game started');
    }

    startTour() {
        this.moveWarriors();
        this.battleWarriors();
        this.updateResources();
        this.renderBoard();
        this.checkVictory();
    }

    moveWarriors() {
        for (let i = this.board.length - 1; i > 0; i--) {
            this.board[i].blue = this.board[i - 1].blue;
        }
        this.board[0].blue = this.blueCastle.queue.splice(0, this.blueCastle.queue.length);

        for (let i = 0; i < this.board.length - 1; i++) {
            this.board[i].red = this.board[i + 1].red;
        }
        this.board[4].red = this.redCastle.queue.splice(0, this.redCastle.queue.length);
    }

    battleWarriors() {
        this.board.forEach((tile, index) => {
            while (tile.blue.length > 0 && tile.red.length > 0) {
                const blueWarrior = tile.blue[0];
                const redWarrior = tile.red[0];

                const blueDamage = blueWarrior.attack();
                const redDamage = redWarrior.attack();

                blueWarrior.takeDamage(redDamage);
                redWarrior.takeDamage(blueDamage);

                console.log(`Tile ${index + 1}: ${blueWarrior.name} attacks ${redWarrior.name} for ${blueDamage} damage.`);
                console.log(`Tile ${index + 1}: ${redWarrior.name} attacks ${blueWarrior.name} for ${redDamage} damage.`);

                if (blueWarrior.healthPoints <= 0) {
                    console.log(`${blueWarrior.name} is dead.`);
                    tile.blue.shift();
                }
                if (redWarrior.healthPoints <= 0) {
                    console.log(`${redWarrior.name} is dead.`);
                    tile.red.shift();
                }
            }
        });
    }

    updateResources() {
        // empty the training phase ui 
      
        this.blueCastle.resources += 1;
        this.redCastle.resources += 1;
        this.blueCastle.updateResourceDisplay();
        this.redCastle.updateResourceDisplay();
    }

    renderBoard() {
        const boardElement = document.querySelector('.fightingBoxes');
        boardElement.innerHTML = '';
        this.board.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('fightingBox');
            const blueWarriors = tile.blue.map(w => `<div class="${w.name.split(' ')[0].toLowerCase()}Div "><div class="name">${w.name}</div><div class="hp">HP: ${w.healthPoints}</div></div>`).join('');
            const redWarriors = tile.red.map(w => `<div class="${w.name.split(' ')[0].toLowerCase()}Div"><div class="name">${w.name}</div><div class="hp">HP: ${w.healthPoints}</div></div>`).join('');
            tileElement.innerHTML = `
                <div class="warriors blue">${blueWarriors}</div>
                <div class="warriors red">${redWarriors}</div>
            `;
            boardElement.appendChild(tileElement);
        });
    }

    checkVictory() {
        if (this.board[4].blue.length > 0) {
            alert('Blue team wins!');
            this.resetGame();
        } else if (this.board[0].red.length > 0) {
            alert('Red team wins!');
            this.resetGame();
        }
    }

    resetGame() {
        this.board = Array.from({ length: 5 }, () => ({ blue: [], red: [] }));
        this.blueCastle.resources = 3;
        this.redCastle.resources = 3;
        this.blueCastle.queue = [];
        this.redCastle.queue = [];
        this.blueCastle.updateResourceDisplay();
        this.redCastle.updateResourceDisplay();
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
