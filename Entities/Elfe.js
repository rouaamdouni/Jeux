import { Warrior } from './Warrior.js'; 

export class Elfe extends Warrior {
    constructor(name) {
        super(name);
        this.force = 20;
    }
}