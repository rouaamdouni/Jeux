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
  showGameResultPopup(result) {
    const winnerImage = document.getElementById("winnerImage");
    const popup = document.getElementById("gameResultPopup");
    const span = document.getElementById("closeGameResult");
    const resultDisplay = document.getElementById("gameResult");

    resultDisplay.innerHTML = result;
    result === "Blue team wins!"
      ? (winnerImage.src = "../images/blueWarriors.png")
      : (winnerImage.src = "../images/redWarriors.png");

    popup.style.display = "block";

    // When the user clicks on <span> (x), close the popup
    span.onclick = function () {
      popup.style.display = "none";
    };

    // When the user clicks anywhere outside of the popup, close it
    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };
  }

  setupGameControls() {
    document
      .querySelector(".startGame")
      .addEventListener("click", () => this.startGame());
    document
      .querySelector(".startTour")
      .addEventListener("click", () => this.startTour());
    document
      .querySelector(".resetGame")
      .addEventListener("click", () => this.resetGame());
  }

  startGame() {
    this.resetGame();
    console.log("Game started");
  }

  startTour() {
    this.tourStarted = true; // Set tourStarted flag to true
    this.startAutomaticTour();
  }

  async startAutomaticTour() {
    while (this.tourStarted) {
      // Move blue warriors first with a delay
      await this.moveWarriors("blue");
      this.renderBoard();

      // Move red warriors after a delay
      await this.moveWarriors("red");
      this.renderBoard();

      // Check for victory conditions
      if (this.checkVictory()) {
        this.tourStarted = false;
        break;
      }

      // Pause the tour after a fight to let users train new players
      if (this.checkCollision()) {
        this.tourStarted = false;
        break;
      }
    }
  }

  async moveWarriors(color) {
    const moveInterval = 500; // 1 second delay

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

    this.renderBoard();
    await new Promise((resolve) => setTimeout(resolve, moveInterval));

    // Detect collisions after moving
    await this.detectCollision();
    this.renderBoard();

    // Wait for the next move interval
    await new Promise((resolve) => setTimeout(resolve, moveInterval));
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

  async detectCollision() {
    for (let index = 0; index < this.board.length; index++) {
      const tile = this.board[index];
      if (tile.blue.length > 0 && tile.red.length > 0) {
        await this.battleWarriors(tile, index);
        this.renderBoard();
      }
    }
  }

  async battleWarriors(tile, index) {
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

        this.renderBoard();

        if (tile.red[0].healthPoints <= 0) {
          console.log(`${tile.red[0].name} is dead.`);
          tile.red.shift();
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between attacks
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

        this.renderBoard();

        if (tile.blue[0].healthPoints <= 0) {
          console.log(`${tile.blue[0].name} is dead.`);
          tile.blue.shift();
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between attacks
      }
    }

    console.log("---------Fighting Ended----------");
    this.updateResources();
    this.tourStarted = false;
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

       
            <div class="character">
              <img src="/images/sprites/blue${w.name
                .split(" ")[0]
                .toLowerCase()}.png" alt="Blue Elffe"
              width="120px" height="70px" 
              id="characterSpriteSheet">
           </div>

           

            <div class="hp">${w.healthPoints}</div></div>`
        )
        .join("");
      const redWarriors = tile.red
        .map(
          (w) => `<div class="${w.name
            .split(" ")[0]
            .toLowerCase()}Div redWarrior" ><div class="name">${w.name}</div>
            
            <div class="character">
              <img src="/images/sprites/red${w.name
                .split(" ")[0]
                .toLowerCase()}.png" alt="Red Elffe"
              width="120px" height="70px"
              id="characterSpriteSheet">
            </div>

            <div class="hp">${w.healthPoints}</div></div>`
        )
        .join("");
      const fightVisuals = `
        <div class="fightVisual">
            <div class="fightItem fightItem-blue"></div>
            <div class="fightItem fightItem-red"></div>
        </div>
        <div class="fightVisual2">
        <div class="fightItem fightItem-blue"></div>
        <div class="fightItem fightItem-red"></div>
    </div>
    <div class="fightVisual3">
    <div class="fightItem fightItem-blue"></div>
    <div class="fightItem fightItem-red"></div>
</div>
    `;
      tileElement.innerHTML = `
                <div class="warriors blue">${blueWarriors}</div>
                <div class="warriors red">${redWarriors}</div>
                ${
                  tile.blue.length > 0 && tile.red.length > 0
                    ? fightVisuals
                    : ""
                }
            `;
      boardElement.appendChild(tileElement);
    });
  }

  checkVictory() {
    // let winnerPopUp = document.createElement("div");
    // const resultOfTheGame = document.getElementById("resultOfTheGame");

    // Check if the last tile (index 4) has blue warriors
    if (this.board[4].blue.length > 0) {
      setTimeout(() => {
        if (!document.querySelector(".winnerPopup")) {
          this.showGameResultPopup("Blue team wins!");
          //     winnerPopUp.innerHTML = `<div class="winnerPopup">
          //   <div class="winnerPopupContent">
          //     <h1
          //       style="
          //         color: blue;
          //       "
          //     >Blue team wins!</h1>
          //     <button class="resetGame">Play Again</button>
          //   </div>
          // </div>`;
          //     document.querySelector(".gameControls").appendChild(winnerPopUp);
          //     document.querySelector(".resetGame").addEventListener("click", () => {
          //       winnerPopUp.remove();
          //       this.resetGame();
          //     });
        }
        this.resetGame();
      }, 1000); // Delay the alert by 2 seconds to allow time for UI update
      return true;
    }
    // Check if the first tile (index 0) has red warriors
    else if (this.board[0].red.length > 0) {
      setTimeout(() => {
        if (!document.querySelector(".winnerPopup")) {
          this.showGameResultPopup("Red team wins!");
          //     winnerPopUp.innerHTML = `<div class="winnerPopup">
          //   <div class="winnerPopupContent">
          //     <h1 style=' color: red;'

          //     >Red team wins!</h1>
          //     <button class="resetGame">Play Again</button>
          //   </div>
          // </div>`;
          //     document.querySelector(".gameControls").appendChild(winnerPopUp);
          //     document.querySelector(".resetGame").addEventListener("click", () => {
          //       winnerPopUp.remove();
          //       this.resetGame();
          //     });
        }
        this.resetGame();
      }, 1000); // Delay the alert by 2 seconds to allow time for UI update
      return true;
    }
    return false;
  }

  resetGame() {
    this.tourStarted = false;
    this.board = Array.from({ length: 5 }, () => ({ blue: [], red: [] }));
    this.blueCastle.resources = 3;
    this.redCastle.resources = 3;
    this.blueCastle.queue = [];
    this.redCastle.queue = [];
    this.blueCastle.updateResourceDisplay();
    this.redCastle.updateResourceDisplay();
    this.blueCastle.resetWorriosDisplay();
    this.redCastle.resetWorriosDisplay();
    this.renderBoard();
  }
}
