import { Warrior } from './Warrior.js';

export class Nain extends Warrior {
    constructor(name) {
        super(name);
        this.healthPoints = 100;
    }

    takeDamage(damage) {
        this.healthPoints -= damage / 2;
    }
}

