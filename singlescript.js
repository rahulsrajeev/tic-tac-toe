const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const computerPlayer = "O";

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayer === computerPlayer ? "Computer's turn" : currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for(let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if(a === '' || b === '' || c === '')
            continue;
        if(a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if(roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if(currentPlayer === computerPlayer) {
        setTimeout(makeComputerMove, 1000);
    }
}


function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if(gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function makeComputerMove() {
    let bestMove = getBestMove();
    let selectedCellIndex = bestMove.index;
  
    let selectedCell = document.querySelector(`[data-cell-index="${selectedCellIndex}"]`);
    handleCellPlayed(selectedCell, selectedCellIndex);
    handleResultValidation();
  }
  
  function getBestMove() {
    let availableMoves = getAvailableMoves();
    let bestScore = -Infinity;
    let bestMove;
  
    availableMoves.forEach(move => {
      gameState[move] = computerPlayer;
      let score = minimax(gameState, 0, false);
      gameState[move] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });
  
    return { index: bestMove };
  }
  
  function getAvailableMoves() {
    return gameState.reduce((accumulator, currentValue, currentIndex) => {
      if (currentValue === "") {
        accumulator.push(currentIndex);
      }
      return accumulator;
    }, []);
  }
  
  function minimax(state, depth, isMaximizingPlayer) {
    let scores = {
      X: -10,
      O: 10,
      draw: 0
    };
  
    if (checkForWin(state, computerPlayer)) {
      return scores[computerPlayer];
    }
  
    if (checkForWin(state, "X")) {
      return scores["X"];
    }
  
    if (checkForDraw(state)) {
      return scores["draw"];
    }
  
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      state.forEach((cell, index) => {
        if (cell === "") {
          state[index] = computerPlayer;
          let score = minimax(state, depth + 1, false);
          state[index] = "";
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      state.forEach((cell, index) => {
        if (cell === "") {
          state[index] = "X";
          let score = minimax(state, depth + 1, true);
          state[index] = "";
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  }
  
  function checkForWin(state, player) {
    for (let i = 0; i < winningConditions.length; i++) {
      let winCondition = winningConditions[i];
      let a = state[winCondition[0]];
      let b = state[winCondition[1]];
      let c = state[winCondition[2]];
      if (a === player && b === player && c === player) {
        return true;
      }
    }
    return false;
  }
  
  function checkForDraw(state) {
    return !state.includes("");
  }
  


document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
