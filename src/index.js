// Import core.js
import "core-js";
import "regenerator-runtime/runtime";

// Import stylesheets
import "./styles/index.scss";
import "./styles/index.css";
import "./styles/normalize.css";

/** * The purpose of this Project was to use the Module Pattern (not ES6 Modules) ** */
/** * That's why there is 2 Modules, and even one inside another ** */

/* * Player Factory Function - Create Player objects * */
const PlayerFactory = (name, mark) => ({
  name,
  mark,
});

/* * Display Module (Module Pattern) * */
// eslint-disable-next-line no-unused-vars
const displayModule = (() => {
  // DOM elements
  const allGameModesContainer = document.querySelector("#all-game-modes-container");
  const twoPlayersMode = document.querySelector("#two-players");
  const computerMode = document.querySelector("#normal-computer");
  const superComputerMode = document.querySelector("#unbeatable-machine");

  const gameButtonsContainer = document.querySelector("#game-buttons-container");
  const playButton = document.querySelector("#play-button");
  const resetButton = document.querySelector("#reset-button");

  const gameInputsContainer = document.querySelector("#game-inputs-container");
  const twoPlayersInput = document.querySelector("#two-players-input");
  const player1Input = document.querySelector("#player-1-input");
  const player2Input = document.querySelector("#player-2-input");

  const playersNamesContainer = document.querySelector("#players-names-container");
  const player1Div = document.querySelector("#player-1-div");
  const player2Div = document.querySelector("#player-2-div");
  const player1Name = document.querySelector("#player-1-name");
  const player2Name = document.querySelector("#player-2-name");

  const changePlayerModeButton = document.querySelector("#change-player-mode-button");

  const alertMessageDiv = document.querySelector("#alert-message-div");

  let gameMode;

  // SetMessageDelay Function
  const setMessageDelay = () => {
    setTimeout(() => {
      alertMessageDiv.style.display = "none";
    }, 1000);
  };

  // Display Wait Message
  const alertMessage = (message) => {
    alertMessageDiv.style.display = "flex";
    alertMessageDiv.textContent = message;
    setMessageDelay();
  };

  //* Gameflow Module (Module Pattern) - Inside of Display Module **/
  const gameFlow = (() => {
    const gameBoardDOM = document.querySelectorAll(".gameboxes");
    const modal = document.querySelector("#modal");
    const closeButton = document.querySelector("#close-button");
    const winnerTrue = document.querySelector("#winner-true");
    const winnersNameTextModal = document.querySelector("#winners-name");
    const tieResultText = document.querySelector("#tie-result");

    // Create two players objects
    const player1 = PlayerFactory("", "X");
    const player2 = PlayerFactory("", "O");

    // Game begins with Player1
    let currentPlayer = player1;
    let playerWins = false;

    // Log each player move
    let gameBoardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Count total movesArray number (to display tie modal when > 8)
    let movesArrayNumber = 0;

    // Gameflow Process
    gameBoardDOM.forEach((item, index) => {
      /** *** ** Computer and Super Computer Functions - Minimax** *** * */
      // Create Promise to generate an async computer move
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      // Return array of available/possible moves
      const possiblemovesArray = () => {
        const computerPossiblesChoicesArray = [];
        // eslint-disable-next-line no-shadow
        gameBoardArray.forEach((item, index) => {
          if (typeof gameBoardArray[index] === "number") {
            computerPossiblesChoicesArray.push(index);
          }
        });
        return computerPossiblesChoicesArray;
      };

      // Check minimax() result
      const minimaxCheckWin = (player) => {
        if (
          (gameBoardArray[0] === player.mark
                    && gameBoardArray[1] === player.mark
                    && gameBoardArray[2] === player.mark)
                || (gameBoardArray[3] === player.mark
                && gameBoardArray[4] === player.mark
                && gameBoardArray[5] === player.mark)
                || (gameBoardArray[6] === player.mark
                && gameBoardArray[7] === player.mark
                && gameBoardArray[8] === player.mark)
                || (gameBoardArray[0] === player.mark
                && gameBoardArray[3] === player.mark
                && gameBoardArray[6] === player.mark)
                || (gameBoardArray[1] === player.mark
                && gameBoardArray[4] === player.mark
                && gameBoardArray[7] === player.mark)
                || (gameBoardArray[2] === player.mark
                && gameBoardArray[5] === player.mark
                && gameBoardArray[8] === player.mark)
                || (gameBoardArray[0] === player.mark
                && gameBoardArray[4] === player.mark
                && gameBoardArray[8] === player.mark)
                || (gameBoardArray[2] === player.mark
                && gameBoardArray[4] === player.mark
                && gameBoardArray[6] === player.mark)
        ) {
          return true;
        }
        return false;
      };

      // Return best supercomputer's move
      const minimax = (player) => {
        // Array of available moves
        const availableMoves = possiblemovesArray();

        if (minimaxCheckWin(player1)) {
          return { score: -10 };
        }
        if (minimaxCheckWin(player2)) {
          return { score: 10 };
        }
        if (availableMoves.length === 0) {
          return { score: 0 };
        }

        // Array where moves are registered
        const moves = [];

        // Loop through all available moves
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < availableMoves.length; i++) {
          // Creates move object
          const move = {};
          // Add index property to move object
          move.index = availableMoves[i];
          gameBoardArray[availableMoves[i]] = player.mark;

          if (player.name === player2.name) {
            const result = minimax(player1); // Returns object named "result"
            move.score = result.score; // Sets result's score property to move object
          } else if (player.name === player1.name) {
            const result = minimax(player2);
            move.score = result.score;
          }

          gameBoardArray[availableMoves[i]] = move.index; // Sets index property to move object
          moves.push(move); // Logs the move object into the moves array
        }

        // Sort out the best move
        let bestMove;
        if (player === player2) {
          let bestScore = -Infinity;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        } else {
          let bestScore = Infinity;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        }

        return moves[bestMove];
      };

      // Check if there is a Winner
      const winnerCheck = (player) => {
        // If winning combination, currentPlayer wins
        if (
          gameBoardArray[0] === player.mark
          && gameBoardArray[1] === player.mark
          && gameBoardArray[2] === player.mark
        ) {
          gameBoardDOM[0].classList.add("winning-boxes");
          gameBoardDOM[1].classList.add("winning-boxes");
          gameBoardDOM[2].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[3] === player.mark
          && gameBoardArray[4] === player.mark
          && gameBoardArray[5] === player.mark
        ) {
          gameBoardDOM[3].classList.add("winning-boxes");
          gameBoardDOM[4].classList.add("winning-boxes");
          gameBoardDOM[5].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[6] === player.mark
          && gameBoardArray[7] === player.mark
          && gameBoardArray[8] === player.mark
        ) {
          gameBoardDOM[6].classList.add("winning-boxes");
          gameBoardDOM[7].classList.add("winning-boxes");
          gameBoardDOM[8].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[0] === player.mark
          && gameBoardArray[3] === player.mark
          && gameBoardArray[6] === player.mark
        ) {
          gameBoardDOM[0].classList.add("winning-boxes");
          gameBoardDOM[3].classList.add("winning-boxes");
          gameBoardDOM[6].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[1] === player.mark
          && gameBoardArray[4] === player.mark
          && gameBoardArray[7] === player.mark
        ) {
          gameBoardDOM[1].classList.add("winning-boxes");
          gameBoardDOM[4].classList.add("winning-boxes");
          gameBoardDOM[7].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[2] === player.mark
          && gameBoardArray[5] === player.mark
          && gameBoardArray[8] === player.mark
        ) {
          gameBoardDOM[2].classList.add("winning-boxes");
          gameBoardDOM[5].classList.add("winning-boxes");
          gameBoardDOM[8].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[2] === player.mark
          && gameBoardArray[4] === player.mark
          && gameBoardArray[6] === player.mark
        ) {
          gameBoardDOM[2].classList.add("winning-boxes");
          gameBoardDOM[4].classList.add("winning-boxes");
          gameBoardDOM[6].classList.add("winning-boxes");
          playerWins = true;
        } else if (
          gameBoardArray[0] === player.mark
          && gameBoardArray[4] === player.mark
          && gameBoardArray[8] === player.mark
        ) {
          gameBoardDOM[0].classList.add("winning-boxes");
          gameBoardDOM[4].classList.add("winning-boxes");
          gameBoardDOM[8].classList.add("winning-boxes");
          playerWins = true;
        } else if (movesArrayNumber > 8) {
          playerWins = "tie";
        }

        // Winner modal appearance
        if (playerWins === true || playerWins === "tie") {
          modal.style.display = "flex";

          if (playerWins === true) {
            winnersNameTextModal.textContent = currentPlayer.name;
            winnerTrue.style.display = "block";
            tieResultText.style.display = "none";
          } else if (playerWins === "tie") {
            winnerTrue.style.display = "none";
            tieResultText.style.display = "block";
          }

          closeButton.addEventListener("click", () => {
            modal.style.display = "none";
          });

          window.addEventListener("click", (event) => {
            if (event.target === modal) {
              // Everything outside the modal content
              modal.style.display = "none";
            }
          });
        }
      };

      /** *** ** End of Computer and Super Computer functions ** *** * */

      // Gameboard Event Listeners
      gameBoardDOM[index].addEventListener("click", () => {
        // Can't play if one player already won
        if (playerWins === true) {
          return;
        }

        // Click on the board is active only after game mode and names haven been chosen
        if (player1.name === "" || player2.name === "") {
          alertMessage("Please, launch the Game before");
          return;
        }
        // Each box can be marked only once
        if (
          gameBoardDOM[index].textContent === "X"
          || gameBoardDOM[index].textContent === "O"
        ) {
          return;
        }
        // Set player's mark on clicked box (if player is neither computer nor supercomputer)
        if (
          currentPlayer.name !== "computer"
          && currentPlayer.name !== "Super Computer"
        ) {
          gameBoardDOM[index].textContent = currentPlayer.mark;
        }

        movesArrayNumber += 1; // Increments total movesArray number (to display tie modal when > 8)

        // Set different X and O colors for both players
        if (currentPlayer === player1) {
          gameBoardDOM[index].classList.add("player1-move");
        } else {
          gameBoardDOM[index].classList.add("player2-move");
        }

        // Put currentPlayer boxchoice into his own array
        gameBoardArray.splice(index, 1, currentPlayer.mark);

        // Check if there is a winner
        winnerCheck(currentPlayer);
        if (playerWins === true) {
          return;
        }

        // Change currentPlayer
        if (currentPlayer === player1) {
          currentPlayer = player2;
        } else {
          currentPlayer = player1;
        }

        /** *** COMPUTER MOVE ** ** */

        // Array of possible moves (free boxes)
        const computerPossiblesChoicesArray = possiblemovesArray();

        if (
          currentPlayer.name === "computer"
          && computerPossiblesChoicesArray.length > 0
        ) {
          // Random chosen box
          const computerChoice = computerPossiblesChoicesArray[
            Math.floor(Math.random() * computerPossiblesChoicesArray.length)
          ];

          // Launch computer attack after some delay in ms
          const asyncComputerMove = async () => {
            await delay(300);

            gameBoardDOM[computerChoice].textContent = currentPlayer.mark;
            gameBoardDOM[computerChoice].classList.add("player2-move");
            gameBoardArray.splice(computerChoice, 1, currentPlayer.mark);

            // eslint-disable-next-line max-len
            movesArrayNumber += 1; // Increments total movesArray number (to display tie modal when > 8)

            winnerCheck(player2);

            // Change currentPlayer
            currentPlayer = player1;
          };
          // Execute the asynchronous attack
          asyncComputerMove();
        }

        /** *** SUPERCOMPUTER MOVE ** ** */

        if (
          currentPlayer.name === "Super Computer"
          && computerPossiblesChoicesArray.length > 0
        ) {
          // Minimax function called
          const superComputerChoice = minimax(player2);

          // Launch computer attack after some delay in ms
          const asyncSuperComputerMove = async () => {
            await delay(300);
            gameBoardDOM[superComputerChoice.index].textContent = currentPlayer.mark;
            gameBoardDOM[superComputerChoice.index].classList.add("player2-move");
            gameBoardArray.splice(superComputerChoice.index, 1, currentPlayer.mark);

            // eslint-disable-next-line max-len
            movesArrayNumber += 1; // Increments total movesArray number (to display tie modal when > 8)

            winnerCheck(player2);

            // Changes currentPlayer
            currentPlayer = player1;
          };
          // Execute the asynchronous attack
          asyncSuperComputerMove();
        }
      });
    });

    // Reinitialize all the game
    function anotherGame() {
      currentPlayer = player1;
      playerWins = false;
      movesArrayNumber = 0;

      // Reset combinations arrays
      gameBoardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];

      // RemovesArray every box class
      gameBoardDOM.forEach((item, index) => {
        gameBoardDOM[index].classList.remove("winning-boxes");
        gameBoardDOM[index].classList.remove("player1-move");
        gameBoardDOM[index].classList.remove("player2-move");

        gameBoardDOM[index].textContent = "";
      });
    }

    return {
      player1,
      player2,
      anotherGame,
    };
  })();

  const startGame = () => {
    if (
      (gameMode === "twoPlayers" && player1Input.value === "")
      || (gameMode === "twoPlayers" && player2Input.value === "")
    ) {
      alertMessage(
        "Please, choose a Name for both Players. Then push the Play Button.",
      );
      return;
    }

    if (gameMode === "computerMode" && player1Input.value === "") {
      alertMessage("Please, choose a Name. Then push the Play Button.");
      return;
    }

    if (gameMode === "superComputerMode" && player1Input.value === "") {
      alertMessage("Please, choose a Name. Then push the Play Button.");
      return;
    }

    // Set players objects names properties from input values
    gameFlow.player1.name = player1Input.value;
    gameFlow.player2.name = player2Input.value;

    // Display players names
    gameInputsContainer.remove();
    playersNamesContainer.style.display = "flex";
    player1Name.textContent = gameFlow.player1.name;
    player2Name.textContent = gameFlow.player2.name;

    twoPlayersInput.style.display = "none";
    playersNamesContainer.style.display = "flex";

    playButton.style.display = "none";
    resetButton.style.display = "flex";
  };

  // 2 Players Mode
  twoPlayersMode.addEventListener("click", () => {
    gameMode = "twoPlayers";

    allGameModesContainer.remove();
    gameInputsContainer.style.display = "flex";
    gameButtonsContainer.style.display = "flex";
    resetButton.style.display = "none";

    player2Div.style.display = "flex";
  });

  // Computer Mode
  computerMode.addEventListener("click", () => {
    gameMode = "computerMode";
    player2Input.value = "computer";

    allGameModesContainer.remove();
    gameInputsContainer.style.display = "flex";
    player1Div.style.flexDirection = "row";
    player1Div.style.width = "70%";
    player1Div.style.justifyContent = "space-between";
    player2Div.style.display = "none";
    gameButtonsContainer.style.display = "flex";
    resetButton.style.display = "none";
  });

  // Supercomputer Mode
  superComputerMode.addEventListener("click", () => {
    gameMode = "superComputerMode";
    player2Input.value = "Super Computer";

    allGameModesContainer.remove();
    gameInputsContainer.style.display = "flex";
    player1Div.style.flexDirection = "row";
    player1Div.style.width = "70%";
    player1Div.style.justifyContent = "space-between";
    player2Div.style.display = "none";
    gameButtonsContainer.style.display = "flex";
    resetButton.style.display = "none";
  });

  // Launch the game when Play Button clicked
  playButton.addEventListener("click", () => {
    startGame();
  });

  // Launch the game when Enter is pushed after name entered
  player1Input.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      startGame();
    }
  });

  // Launch the game when Enter is pushed after name entered
  player2Input.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      startGame();
    }
  });

  // Reset Button - Play again (without changing Player Mode)
  resetButton.addEventListener("click", () => {
    alertMessage("New Game");
    gameFlow.anotherGame();

    playButton.style.display = "none";
    resetButton.style.display = "flex";
  });

  // Change Player Mode Button
  changePlayerModeButton.addEventListener("click", () => {
    window.location.reload();
  });
})();
