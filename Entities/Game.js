import { Castle } from "./Castle.js";

export class Game {
  constructor() {
    this.tourStarted = false;
    this.blueCastle = new Castle("blue");
    this.redCastle = new Castle("red");
    this.board = Array.from({ length: 5 }, () => ({ blue: [], red: [] }));
    this.setupGameControls();
    this.renderBoard();
  }

  setupGameControls() {
    document
      .querySelector(".startGame")
      .addEventListener("click", () => this.startGame());
    document
      .querySelector(".startTour")
      .addEventListener("click", () => this.startTour());
  }

  startGame() {
    this.resetGame();
    console.log("Game started");
  }

  startTour() {
    this.tourStarted = true; // Set tourStarted flag to true
    this.startAutomaticTour();

    // Check for victory conditions
    this.checkVictory();
  }

  async startAutomaticTour() {
    if (this.tourStarted) {
      // Move blue warriors first
      this.moveWarriors("blue");

      // Move red warriors after a delay of 0.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await this.moveWarriors("red");

      // Render the board after both movements
      this.renderBoard();
    }
  }

  async moveWarriors(color) {
    const moveInterval = 1000; // 1 second delay

    if (!this.tourStarted) return;

    if (color === "blue") {
      // Move blue warriors forward
      for (let i = this.board.length - 1; i > 0; i--) {
        if (
          this.board[i].blue.length === 0 &&
          this.board[i - 1].blue.length > 0
        ) {
          this.board[i].blue = this.board[i - 1].blue;
          this.board[i - 1].blue = [];
        }
      }
      this.board[0].blue = this.blueCastle.queue.splice(
        0,
        this.blueCastle.queue.length
      );
    } else if (color === "red") {
      // Move red warriors backward
      for (let i = 0; i < this.board.length - 1; i++) {
        if (
          this.board[i].red.length === 0 &&
          this.board[i + 1].red.length > 0
        ) {
          this.board[i].red = this.board[i + 1].red;
          this.board[i + 1].red = [];
        }
      }
      this.board[4].red = this.redCastle.queue.splice(
        0,
        this.redCastle.queue.length
      );
    }

    // Detect collisions after moving
    this.detectCollision();

    // Render the board after moving
    this.renderBoard();

    // Wait for the next move interval
    await new Promise((resolve) => setTimeout(resolve, moveInterval));

    // If there are no collisions and tour is still ongoing, continue moving
    if (!this.checkCollision() && this.tourStarted) {
      await this.moveWarriors(color);
    }
  }
  checkCollision() {
    let collisionDetected = false;
    this.board.forEach((tile) => {
      if (tile.blue.length > 0 && tile.red.length > 0) {
        collisionDetected = true;
      }
    });
    return collisionDetected;
  }
  detectCollision() {
    this.board.forEach((tile, index) => {
      if (tile.blue.length > 0 && tile.red.length > 0) {
        this.battleWarriors(tile, index);
      }
    });
  }

  battleWarriors(tile, index) {
    console.log("---------Fighting Started----------");

    while (tile.blue.length > 0 && tile.red.length > 0) {
      // Blue will attack first; each blue warrior will attack each red warrior
      for (let i = 0; i < tile.blue.length && tile.red.length > 0; i++) {
        const blueWarrior = tile.blue[i];
        const blueDamage = blueWarrior.attack();
        tile.red[0].takeDamage(blueDamage);

        console.log(
          ` Tile ${index + 1}: Blue ${blueWarrior.name} | ${
            blueWarrior.healthPoints
          } attacks Red ${tile.red[0].name} for ${blueDamage} damage. | ${
            tile.red[0].healthPoints
          }`
        );

        if (tile.red[0].healthPoints <= 0) {
          console.log(`${tile.red[0].name} is dead.`);
          tile.red.shift();
        }
        this.checkVictory();
      }

      // Red will attack second; each red warrior will attack each blue warrior
      for (let i = 0; i < tile.red.length && tile.blue.length > 0; i++) {
        const redWarrior = tile.red[i];
        const redDamage = redWarrior.attack();
        tile.blue[0].takeDamage(redDamage);

        console.log(
          `Tile ${index + 1}: Red ${redWarrior.name} attacks Blue ${
            tile.blue[0].name
          } for ${redDamage} damage. | ${tile.blue[0].healthPoints}`
        );

        if (tile.blue[0].healthPoints <= 0) {
          console.log(`${tile.blue[0].name} is dead.`);
          tile.blue.shift();
        }
        this.checkVictory();
      }
    }

    this.tourStarted = false; // Set tourStarted flag to false after fighting ends
    this.updateResources();
    console.log("---------Fighting Ended----------");
  }

  updateResources() {
    this.blueCastle.trainingArea.innerHTML = "";
    this.redCastle.trainingArea.innerHTML = "";

    this.blueCastle.resources += 1;
    this.redCastle.resources += 1;
    this.blueCastle.updateResourceDisplay();
    this.redCastle.updateResourceDisplay();
  }

  renderBoard() {
    const boardElement = document.querySelector(".fightingBoxes");
    boardElement.innerHTML = "";
    this.board.forEach((tile, index) => {
      const tileElement = document.createElement("div");
      tileElement.classList.add("fightingBox");
      const blueWarriors = tile.blue
        .map(
          (w) => `<div class="${w.name
            .split(" ")[0]
            .toLowerCase()}Div blueWarrior"><div class="name">${w.name}</div>
            <img src="../images/blue/blue-${w.name
              .split(" ")[0]
              .toLowerCase()}.png" alt="warrior img">

            <div class="hp">HP: ${w.healthPoints}</div></div>`
        )
        .join("");
      const redWarriors = tile.red
        .map(
          (w) => `<div class="${w.name
            .split(" ")[0]
            .toLowerCase()}Div redWarrior" ><div class="name">${w.name}</div>
            
            <img src="../images/red/red-${w.name
              .split(" ")[0]
              .toLowerCase()}.png" alt="warrior img">

            <div class="hp">HP: ${w.healthPoints}</div></div>`
        )
        .join("");
      tileElement.innerHTML = `
                <div class="warriors blue">${blueWarriors}</div>
                <div class="warriors red">${redWarriors}</div>
            `;
      boardElement.appendChild(tileElement);
    });
  }

  checkVictory() {
    console.log("Checking for victory");
    console.log(this.board[4].blue);
    console.log(this.board[0].red);

    // Check if the last tile (index 4) has blue warriors
    if (this.board[4].blue.length > 0) {
      this.renderBoard();
      setTimeout(() => {
        alert("Blue team wins!");
        this.resetGame();
      }, 1000); // Delay the alert by 1 second to allow time for UI update
    }
    // Check if the last tile (index 4) has red warriors
    else if (this.board[0].red.length > 0) {
      this.renderBoard();
      setTimeout(() => {
        alert("Red team wins!");
        this.resetGame();
      }, 1000); // Delay the alert by 1 second to allow time for UI update
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
