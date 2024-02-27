function Gameboard() {
  const rows = 3;
  const cols = 3;
  const board = []
  //Creating a 3x3 board

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell())
    }
  }

  const getBoard = () => board;

  //check if cell is empty string, if true, place player.marker;
  const dropToken = (row, col, player) => {
    const cell = board[row][col];

    if (cell.getValue() === '') {
      cell.addMark(player);
      return true;
    } else {
      return false;
    }
  }

  const reset = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = board[i][j];
        cell.empty();
      }
    }

  }
  //prints board with cell.value
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues)
  }

  return { getBoard, dropToken, printBoard, reset };
}

//creates a cell instance for each square
function Cell() {
  let value = '';

  const addMark = (player) => {
    value = player;
  }

  const empty = () => {
    value = '';
  }

  const getValue = () => {
    return value;
  }

  return {
    addMark,
    getValue,
    empty
  }
}

//creates game
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  //initializes gameboard object
  const board = Gameboard();
  let turn = 0;
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const players = [
    {
      name: playerOneName,
      marker: 'X',
      wins: 0
    },
    {
      name: playerTwoName,
      marker: 'O',
      wins: 0
    }
  ];

  //set player1 to make the first move
  let activePlayer = players[0];

  //sets active player by checking if active player is equal to players[0],
  //if true, sets to player[1], if false, sets to player[0].
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  //prints board after each turn
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, col) => {
    // board.printBoard();
    const freeCell = board.dropToken(row, col, getActivePlayer().marker);
    //if true then switch player, if false activePlayer = activePlayer
    //printNewRound?
    if (freeCell) {
      turn++
      if (turn >= 5) {
        if (checkForWin()) {
          activePlayer.wins += 1;
          getWins();
          console.log(`${getActivePlayer().name} wins the game!`)
        } else {
          switchPlayerTurn();
          printNewRound();
        }
      } else {
        switchPlayerTurn();
        printNewRound();
      }
      if (turn >= 8 && !checkForWin() && checkForDraw()) {
        console.log(`It's a draw!`)
      }

    } else {
      console.log(`Cell is full. Try again ${getActivePlayer().name}.`)
    }
  }

  const checkForWin = () => {
    const b = board.getBoard();
    //check rows
    for (let i = 0; i < 3; i++) {
      if (b[i][0].getValue() === b[i][1].getValue() && b[i][1].getValue() === b[i][2].getValue() && b[i][0].getValue() !== '') {
        return true
      }
    }
    //check columns
    for (let i = 0; i < 3; i++) {
      if (b[0][i].getValue() === b[1][i].getValue() && b[1][i].getValue() === b[2][i].getValue() && b[0][i].getValue() !== '') {
        return true
      }
    }
    //check diags
    if (b[0][0].getValue() === b[1][1].getValue() && b[1][1].getValue() === b[2][2].getValue() && b[0][0].getValue() !== '') {
      return true
    }
    if (b[0][2].getValue() === b[1][1].getValue() && b[1][1].getValue() === b[2][0].getValue() && b[0][2].getValue() !== '') {
      return true
    }
  }


  const checkForDraw = () => {
    const b = board.getBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j].getValue() === '') {
          return false;
        }
      }
    }
    return true
  }

  const getWins = () => {
    const p1Score = document.querySelector('.p1-wins');
    const p2Score = document.querySelector('.p2-wins');

    p1Score.textContent = players[0].wins;
    p2Score.textContent = players[1].wins;

  }

  printNewRound();

  return {
    print: board.printBoard,
    printNewRound,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkForWin,
    checkForDraw,
    getWins,
    reset: board.reset
  }

}

function ScreenController() {
  const p1 = document.querySelector('#p1').value;
  const p2 = document.querySelector('#p2').value;
  // const playAgain = document.querySelector('.play-again');

  const game = GameController(p1, p2);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const modal = document.querySelector('[data-modal]');
  const closeBtn = document.querySelector('.close');
  const again = game.reset()


  const updateScreen = () => {
    boardDiv.textContent = '';

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

    board.forEach((row, rowIndex) => {
      row.forEach((column, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add('cell');
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = column.getValue();
        boardDiv.appendChild(cellButton);
      })
    })

    if (game.checkForWin()) {
      modal.showModal();
      playerTurnDiv.textContent = `${activePlayer.name} wins the game!`
    } else if (game.checkForDraw()) {
      playerTurnDiv.textContent = `It's a draw!`;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
    }
  }


  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;
    if (!selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();

    if (game.checkForWin()) {
      boardDiv.removeEventListener("click", clickHandlerBoard)
    }

  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();

  const playAgain = document.querySelector('.play-again');
  playAgain.addEventListener("click", (e) => {
    console.log('click')
    game.reset();
    game.printNewRound();
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
    modal.close();
  })

  return {
    updateScreen,

  }
}



const startBtn = document.querySelector('.start')

function startGame() {
  const board = document.querySelector('.container');
  const startScreen = document.querySelector('.start-screen');
  const score = document.querySelector('.score-board');


  startScreen.style.display = 'none';
  board.style.display = 'grid';
  score.style.display = 'flex';

  if (p1.value === '') {
    p1.value = 'Player One'
  }
  if (p2.value === '') {
    p2.value = 'Player Two'
  }

  ScreenController(p1, p2);
  console.log('cliked')
}
startBtn.addEventListener("click", startGame)


