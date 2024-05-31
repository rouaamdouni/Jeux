import { Warrior } from './Warrior.js'; 

export class ChefNain extends Warrior {
    constructor(name) {
        super(name);
    }
    takeDamage(damage) {
        this.healthPoints -= damage / 4;
    }
}