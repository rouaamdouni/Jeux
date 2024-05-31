export class Warrior {
  constructor(name) {
    this.name = name;
    this.force = 10;
    this.healthPoints = 100;
  }

  getRandomNumber() {
    var randomNumber = Math.floor(Math.random() * 3);
    return randomNumber + 1;
  }

  attack() {
    let damage = 0;
    if ( this.healthPoints > 0)
    for (let i = 0; i <= this.force; i++) {
    damage += this.getRandomNumber();
    }

  
    // console.log(damage);

    return damage;
  }

  takeDamage(damage) {
    if (this.healthPoints > damage) {
      this.healthPoints -= damage;
    } else this.healthPoints = 0;
    console.log(this.healthPoints);
  }

  isAlive() {
    return this.healthPoints > 0;
  }

  isKilled() {
    return this.healthPoints <= 0;
  }
}
