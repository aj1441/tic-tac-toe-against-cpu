let squaresArray = ["", "", "", "", "", "", "", "", ""];
let playerSymbol;
let currentPlayer;
let tally = {
  X: 0,
  draw: 0,
  O: 0
};
let whosTurn = document.getElementById("whosTurn");
const reset = document.getElementById("resetBtn");
const board = document.getElementById("board");
const squares = document.querySelectorAll(".box");
const winningBanner = document.getElementById("winningBanner");
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
///---------section of code for Initialize Game Div--------------///
// Event listener for "X" button
document.getElementById("chooseX").addEventListener("click", () => {
  playerSymbol = "X";
  currentPlayer = "X";
  console.log("x", playerSymbol, currentPlayer);
});
// Event listener for "O" button
document.getElementById("chooseO").addEventListener("click", () => {
  playerSymbol = "O";
  currentPlayer = "O";
});
// Event listener for form submission
const form = document.getElementById("form");
form.addEventListener("submit", (e) => onFormSubmit(e));

const onFormSubmit = (event) => {
  event.preventDefault();
  // Ensure a symbol is selected
  if (!playerSymbol) {
    alert("Please select a mark (X or O) before starting the game.");
    return;
  }
  console.log("Player 1's Symbol:", playerSymbol);
  document.getElementById("initializeGameWrapper").style.display = "none"; //hides the div
  board.style.display = "block";
  winningBanner.style.display = "none";
  form.reset();
  startGame();
};

///----------------------------------------------------------------------///
///-----------Section for Game board and play------------------///
const startGame = () => {
  squares.forEach((box) => box.addEventListener("click", boxClicked));
};

//--Below function will listen to see if the box is clicked and if so place the playerSymbol in that box and save that box value to playerArray-------//
function boxClicked(event) {
  const box = event.target;
  const id = box.id;
  if (squaresArray[id] === "" && currentPlayer === playerSymbol) {
    //only allows a player to click if it is their turn//
    updateBox(box, id);
    if (!checkForWinner()) {
      currentPlayer = currentPlayer == "X" ? "O" : "X";
      // Delay the computer's turn
      setTimeout(computerTurn, 1000); // 1000 milliseconds = 1 second
    }
  }
}
//-----below function will save the box it will place a symbol in the clicked box and save the array index number of that box  and save it to the current array---//
function updateBox(box, index) {
  squaresArray[index] = currentPlayer;
  // inorder for the fontawsome to work here I need to change this from box.textContent to .innerHtml
  box.textContent = currentPlayer;
  if (currentPlayer === "X") {
    box.style.color = "#31C3BD";
    box.style.fontSize = "3rem";
    box.style.fontWeight = "bold";
  } else {
    box.style.color = "#F2B137";
    box.style.fontSize = "3rem";
    box.style.fontWeight = "bold";
  }
  // === "X" ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-o"></i>`;
}

//----------below is function for the computer turn------------//
function computerTurn() {
  //--creating a local variable by maping through squaresArray and pulling out only the blank boxes.
  const emptySquares = squaresArray
    .map((val, idx) => (val === "" ? idx : null))
    .filter((val) => val !== null);
  //--looping throught the new array new array and using math.random for the computer to pick a box, check for winner and switch players.
  if (emptySquares.length > 0) {
    const randomBox = Math.floor(Math.random() * emptySquares.length);
    const computerSquareId = emptySquares[randomBox];
    const box = squares[computerSquareId];
    updateBox(box, computerSquareId);
    checkForWinner();
    //--below changes back to playerSymbol so game can continue-----//
    currentPlayer = playerSymbol;
  }
}

//--below function will check to see if there is a winner-------//
const checkForWinner = () => {
  //-- by declaring the variable const combo inside of the loop, this declares a constant variable for each iteration of the loop. during each iteration combo will be able to take on the value of one of the elements of winningCombos. Since combo is declared with const, it will only exist within the current iteration. Const works here because the value of combo changes for each iteration and is not reassigned within any given iteration.
  for (const combo of winningCombos) {
    //--below is declaring const [a, b, c] which will be equal to the current iteration of combo and then will compare it to see if is is a winner. If a winner then endOfRound() which will be the same as the symbol in box a.
    const [a, b, c] = combo;
    if (
      squaresArray[a] &&
      squaresArray[a] === squaresArray[b] &&
      squaresArray[a] === squaresArray[c]
    ) {
      endOfRound(squaresArray[a]);
      addToTally(squaresArray[a]);
      let winner = squaresArray[a];
      if (winner === "X") {
        document.getElementById("xTally").textContent = tally.X;
      } else {
        document.getElementById("oTally").textContent = tally.O;
      }
      return true;
    }
  }
  //-- if no squares are empty and no winner above then draw----------
  if (!squaresArray.includes("")) {
    // Check for a draw
    endOfRound("draw");
    addToTally("draw");
    document.getElementById("tieTally").textContent = tally.draw;
    return true;
  }
  //---- if neither of the above are true then exit----------
  return false;
};
//------Need a function to loop through the object tally and ad 1----
let addToTally = (win) => {
  if (win in tally) {
    tally[win] += 1;
  }
};
// ---function to reset Tally----/
const resetTally = () => {
    console.log("tally", tally);
    Object.keys(tally).forEach(key => {
    tally[key] = 0;
});
console.log(tally);
};



//-------------------below function will trigger the end of round popup section and will show who the winner is populate functions for quit, reset--------------//
function endOfRound(winner) {
  winningBanner.style.display = "block";
  document.getElementById("quit").addEventListener("click", resetGame);
  document.getElementById("nextRound").addEventListener("click", nextRound);

  if (winner === "draw") {
    document.getElementById("winLoseStmt").textContent = `It's a draw!`;
    document.getElementById(
      "winnerStmt"
    ).textContent = `No one wins this round.`;
  } else {
    document.getElementById("winLoseStmt").textContent = `${
      winner === playerSymbol ? "YOU WON!" : "OH NO, YOU LOST..."
    }`;
    document.getElementById(
      "winnerStmt"
    ).textContent = `${winner} TAKES THE ROUND`;
  }
}



// this will reset the game, hide board and popup div #
// this will reset the game, hide board and show div #initializeGameWrapper
const resetGame = () => {
  squaresArray = ["", "", "", "", "", "", "", "", ""];
  squares.forEach((box) => (box.textContent = ""));
  document.getElementById("initializeGameWrapper").style.display = "block";
  board.style.display = "none";
  winningBanner.style.display = "none";
  resetTally();
  document.getElementById("oTally").textContent = tally.O;
  document.getElementById("xTally").textContent = tally.X;
  document.getElementById("tieTally").textContent = tally.draw;
};
reset.addEventListener("click", resetGame);

const nextRound = () => {
  squaresArray = ["", "", "", "", "", "", "", "", ""];
  squares.forEach((box) => (box.textContent = ""));
  winningBanner.style.display = "none";
  board.style.display = "block";
};

