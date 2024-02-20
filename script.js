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

  //prints board with cell.value
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues)
  }

  return { getBoard, dropToken, printBoard };
}

//creates a cell instance for each square
function Cell() {
  let value = '';

  const addMark = (player) => {
    value = player;
  }

  const getValue = () => {
    return value;
  }

  return {
    addMark,
    getValue
  }
}

//creates game
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  //initializes gameboard object
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: 'X'
    },
    {
      name: playerTwoName,
      marker: 'O'
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
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
    board.dropToken(row, col, getActivePlayer().marker);

    switchPlayerTurn();
    printNewRound();
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer
  }

}


