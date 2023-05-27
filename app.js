const candies = ['Red', 'Blue', 'Purple', 'Green', 'Orange', 'Yellow'];
let board = [];
const rows = 9;
const columns = 9;
let score = 0;
let gameStarted = false;
let testData = [
  ['Green', 'Blue', 'Blue', 'Green', 'Blue-Striped-Horizontal', 'Blue'],
  ['Green', 'Yellow', 'Orange', 'Green', 'Yellow', 'Orange'],
  ['Green', 'Green', 'Blue', 'Green', 'Green', 'Blue'],
  ['Blue', 'Green', 'Blue', 'Blue', 'Green', 'Blue'],
  ['Yellow', 'Yellow', 'Orange', 'Yellow', 'Yellow', 'Orange'],
  ['Blue', 'Orange', 'Green', 'Blue', 'Orange', 'Green'],
  ['Orange', 'Blue', 'Green', 'Green', 'Blue', 'Green-Striped-Horizontal'],
  ['Orange', 'Green', 'Blue', 'Orange', 'Green', 'Blue'],
  [
    'Orange',
    'Orange',
    'Orange-Striped-Vertical',
    'Orange',
    'Orange',
    'Orange-Striped-Horizontal',
  ],
];

window.onload = function () {
  startGame();
  window.setInterval(function () {
    if (!gameStarted) {
      return;
    }
    crushColumn();
    crushRow();
    crushCandy();
    slideCandy();
    generateCandy();
  }, 100);
};

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

// function startGame() {
//   for (r = 0; r < rows; r++) {
//     let row = [];
//     for (c = 0; c < columns; c++) {
//       // img id = 0-0 or 0-1 or whatever coordinate the candy img is located so that it can be targeted for whatever dragging, dropping, and replacing with other candy 'power ups'
//       let tile = document.createElement('img');
//       tile.id = r.toString() + '-' + c.toString();
//       tile.src = './images/' + randomCandy() + '.png';

//       tile.addEventListener('dragstart', dragStart);
//       tile.addEventListener('dragover', dragOver);
//       tile.addEventListener('dragenter', dragEnter);
//       tile.addEventListener('dragleave', dragLeave);
//       tile.addEventListener('drop', dragDrop);
//       tile.addEventListener('dragend', dragEnd);

//       document.getElementById('board').append(tile);
//       row.push(tile);
//     }
//     board.push(row);
//   }
//   console.log(board);
// }

function startGame() {
  for (r = 0; r < rows; r++) {
    let row = [];
    for (c = 0; c < columns; c++) {
      // img id = 0-0 or 0-1 or whatever coordinate the candy img is located so that it can be targeted for whatever dragging, dropping, and replacing with other candy 'power ups'
      if (c < 6) {
        let tile = document.createElement('img');
        tile.id = r.toString() + '-' + c.toString();
        tile.src = './images/' + testData[r][c] + '.png';

        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragover', dragOver);
        tile.addEventListener('dragenter', dragEnter);
        tile.addEventListener('dragleave', dragLeave);
        tile.addEventListener('drop', dragDrop);
        tile.addEventListener('dragend', dragEnd);

        document.getElementById('board').append(tile);
        row.push(tile);
      } else {
        let tile = document.createElement('img');
        tile.id = r.toString() + '-' + c.toString();
        tile.src = './images/' + randomCandy() + '.png';

        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragover', dragOver);
        tile.addEventListener('dragenter', dragEnter);
        tile.addEventListener('dragleave', dragLeave);
        tile.addEventListener('drop', dragDrop);
        tile.addEventListener('dragend', dragEnd);

        document.getElementById('board').append(tile);
        row.push(tile);
      }
    }
    board.push(row);
  }
  console.log(board);
}

function dragStart() {
  curTile = this;
}
function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  otherTile = this;
}

function dragEnd() {
  if (curTile.src.includes('blank') || otherTile.src.includes('blank')) {
    return;
  }
  if (!gameStarted) {
    gameStarted = true;
  }
  let curCoords = curTile.id.split('-'); // turns coordinates of clicked tile(or candy, for exaple '0-0') into ['0', '0']
  let r = parseInt(curCoords[0]);
  let c = parseInt(curCoords[1]);

  let otherCoords = otherTile.id.split('-'); // same as curCoords but for the tile that is being dropped on to
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = r == r2 && c2 == c - 1;
  let moveRight = r == r2 && c2 == c + 1;
  let moveUp = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2;

  let isAdjacent = moveRight || moveLeft || moveUp || moveDown;

  if (isAdjacent) {
    let curImg = curTile.src;
    let otherImg = otherTile.src;
    curTile.src = otherImg;
    otherTile.src = curImg;

    let validMove = checkValid();

    if (!validMove) {
      let curImg = curTile.src;
      let otherImg = otherTile.src;
      curTile.src = otherImg;
      otherTile.src = curImg;
    }
  }
}

function crushCandy() {
  // crushColumn();
  crushFive();
  crushFour();
  crushThree();
  document.getElementById('score').innerText = score;
}

function crushThree() {
  // logic for crushing candy in rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        !candyOne.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        score += 30;
      }
    }
  }
  // logic for crushing candies in columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        !candyOne.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        score += 30;
      }
    }
  }
}

function crushFour() {
  // rows logic
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];
      let candyFour = board[r][c + 3];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        candyFour.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Blue-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        candyFour.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Green-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        candyFour.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Red-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        candyFour.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Yellow-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        candyFour.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Purple-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        candyFour.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Orange-Striped-Horizontal.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      }
    }
  }
  // columns logic
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];
      let candyFour = board[r + 3][c];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        candyFour.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Blue-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        candyFour.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Green-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        candyFour.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Red-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        candyFour.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Yellow-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        candyFour.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Purple-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        candyFour.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Orange-Striped-Vertical.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      }
    }
  }
}
function crushFive() {
  // rows logic
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 4; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];
      let candyFour = board[r][c + 3];
      let candyFive = board[r][c + 4];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        candyFour.src.includes('Blue') &&
        candyFive.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Blue-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        candyFour.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Green-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        candyFour.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Red-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        candyFour.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Yellow-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        candyFour.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Purple-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        candyFour.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Orange-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      }
    }
  }
  // columns logic
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 4; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];
      let candyFour = board[r + 3][c];
      let candyFive = board[r + 4][c];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        candyFour.src.includes('Blue') &&
        candyFive.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Blue-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        candyFour.src.includes('Green') &&
        candyFive.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Green-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        candyFour.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Red-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        candyFour.src.includes('Yellow') &&
        candyFive.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Yellow-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        candyFour.src.includes('Purple') &&
        candyFive.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Purple-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      } else if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        candyThree.src == candyFour.src &&
        candyFour.src == candyFive.src &&
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        candyFour.src.includes('Orange') &&
        candyFive.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank') &&
        !candyFour.src.includes('blank')
      ) {
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/Orange-Wrapped.png';
        candyThree.src = './images/blank.png';
        candyFour.src = './images/blank.png';
        candyFive.src = './images/blank.png';
        score += 40;
      }
    }
  }
}

function ridColumn(columnIndex) {
  console.log(columnIndex);
  for (let r = 0; r < rows; r++) {
    let candy = board[r][columnIndex];
    if (!candy.src.includes('blank')) {
      candy.src = './images/blank.png';
      score += 100;
    }
  }
}

function ridRow(rowIndex) {
  console.log(rowIndex);
  for (let c = 0; c < columns; c++) {
    let candy = board[rowIndex][c];
    if (!candy.src.includes('blank')) {
      candy.src = '/.images.blank.png';
      score += 100;
    }
  }
}

function crushRow() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];

      if (
        candyOne.src.includes('Blue-Striped-Horizontal') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue-Striped-Horizontal') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Green-Striped-Horizontal') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green-Striped-Horizontal') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
      if (
        candyOne.src.includes('Red-Striped-Horizontal') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red-Striped-Horizontal') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
      if (
        candyOne.src.includes('Yellow-Striped-Horizontal') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow-Striped-Horizontal') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
      if (
        candyOne.src.includes('Purple-Striped-Horizontal') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple-Striped-Horizontal') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
      if (
        candyOne.src.includes('Orange-Striped-Horizontal') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange-Striped-Horizontal') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];

      if (
        candyOne.src.includes('Blue-Striped-Horizontal') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue-Striped-Horizontal') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }

      if (
        candyOne.src.includes('Green-Striped-Horizontal') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green-Striped-Horizontal') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }

      if (
        candyOne.src.includes('Red-Striped-Horizontal') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red-Striped-Horizontal') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }

      if (
        candyOne.src.includes('Yellow-Striped-Horizontal') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow-Striped-Horizontal') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }

      if (
        candyOne.src.includes('Purple-Striped-Horizontal') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple-Striped-Horizontal') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }

      if (
        candyOne.src.includes('Orange-Striped-Horizontal') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange-Striped-Horizontal') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange-Striped-Horizontal') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridRow(r);
        break;
      }
    }
  }
}
function crushColumn() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];

      if (
        candyOne.src.includes('Blue-Striped-Vertical') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue-Striped-Vertical') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }

      if (
        candyOne.src.includes('Green-Striped-Vertical') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green-Striped-Vertical') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }
      if (
        candyOne.src.includes('Red-Striped-Vertical') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red-Striped-Vertical') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }
      if (
        candyOne.src.includes('Yellow-Striped-Vertical') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow-Striped-Vertical') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }
      if (
        candyOne.src.includes('Purple-Striped-Vertical') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple-Striped-Vertical') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }
      if (
        candyOne.src.includes('Orange-Striped-Vertical') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange-Striped-Vertical') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        break;
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];

      if (
        candyOne.src.includes('Blue-Striped-Vertical') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue-Striped-Vertical') &&
        candyThree.src.includes('Blue') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Blue') &&
        candyTwo.src.includes('Blue') &&
        candyThree.src.includes('Blue-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Green-Striped-Vertical') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green-Striped-Vertical') &&
        candyThree.src.includes('Green') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Green') &&
        candyTwo.src.includes('Green') &&
        candyThree.src.includes('Green-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Red-Striped-Vertical') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red-Striped-Vertical') &&
        candyThree.src.includes('Red') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Red') &&
        candyTwo.src.includes('Red') &&
        candyThree.src.includes('Red-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Yellow-Striped-Vertical') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow-Striped-Vertical') &&
        candyThree.src.includes('Yellow') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Yellow') &&
        candyTwo.src.includes('Yellow') &&
        candyThree.src.includes('Yellow-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Purple-Striped-Vertical') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple-Striped-Vertical') &&
        candyThree.src.includes('Purple') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Purple') &&
        candyTwo.src.includes('Purple') &&
        candyThree.src.includes('Purple-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }

      if (
        candyOne.src.includes('Orange-Striped-Vertical') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c);
        candyTwo.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange-Striped-Vertical') &&
        candyThree.src.includes('Orange') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 1);
        candyOne.src = './images/blank.png';
        candyThree.src = './images/blank.png';
        break;
      } else if (
        candyOne.src.includes('Orange') &&
        candyTwo.src.includes('Orange') &&
        candyThree.src.includes('Orange-Striped-Vertical') &&
        !candyOne.src.includes('blank') &&
        !candyTwo.src.includes('blank') &&
        !candyThree.src.includes('blank')
      ) {
        ridColumn(c + 2);
        candyOne.src = './images/blank.png';
        candyTwo.src = './images/blank.png';
        break;
      }
    }
  }
}

function checkValid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candyOne = board[r][c];
      let candyTwo = board[r][c + 1];
      let candyThree = board[r][c + 2];

      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        !candyOne.src.includes('blank')
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Blue-Striped-Vertical') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue-Striped-Vertical') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue-Striped-Horizontal') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue-Striped-Horizontal') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Green-Striped-Vertical') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green-Striped-Vertical') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green-Striped-Horizontal') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green-Striped-Horizontal') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Red-Striped-Vertical') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red-Striped-Vertical') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red-Striped-Horizontal') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red-Striped-Horizontal') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Yellow-Striped-Vertical') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow-Striped-Vertical') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow-Striped-Horizontal') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow-Striped-Horizontal') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Purple-Striped-Vertical') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple-Striped-Vertical') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple-Striped-Horizontal') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple-Striped-Horizontal') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Orange-Striped-Vertical') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange-Striped-Vertical') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange-Striped-Horizontal') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange-Striped-Horizontal') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candyOne = board[r][c];
      let candyTwo = board[r + 1][c];
      let candyThree = board[r + 2][c];
      if (
        candyOne.src == candyTwo.src &&
        candyTwo.src == candyThree.src &&
        !candyOne.src.includes('blank')
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Blue-Striped-Vertical') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue-Striped-Vertical') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue-Striped-Horizontal') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue-Striped-Horizontal') &&
          candyThree.src.includes('Blue') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Blue') &&
          candyTwo.src.includes('Blue') &&
          candyThree.src.includes('Blue-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Green-Striped-Vertical') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green-Striped-Vertical') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green-Striped-Horizontal') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green-Striped-Horizontal') &&
          candyThree.src.includes('Green') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Green') &&
          candyTwo.src.includes('Green') &&
          candyThree.src.includes('Green-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Red-Striped-Vertical') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red-Striped-Vertical') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red-Striped-Horizontal') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red-Striped-Horizontal') &&
          candyThree.src.includes('Red') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Red') &&
          candyTwo.src.includes('Red') &&
          candyThree.src.includes('Red-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Yellow-Striped-Vertical') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow-Striped-Vertical') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow-Striped-Horizontal') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow-Striped-Horizontal') &&
          candyThree.src.includes('Yellow') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Yellow') &&
          candyTwo.src.includes('Yellow') &&
          candyThree.src.includes('Yellow-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Purple-Striped-Vertical') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple-Striped-Vertical') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple-Striped-Horizontal') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple-Striped-Horizontal') &&
          candyThree.src.includes('Purple') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Purple') &&
          candyTwo.src.includes('Purple') &&
          candyThree.src.includes('Purple-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      } else if (
        (candyOne.src.includes('Orange-Striped-Vertical') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange-Striped-Vertical') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange-Striped-Vertical') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange-Striped-Horizontal') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange-Striped-Horizontal') &&
          candyThree.src.includes('Orange') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank')) ||
        (candyOne.src.includes('Orange') &&
          candyTwo.src.includes('Orange') &&
          candyThree.src.includes('Orange-Striped-Horizontal') &&
          !candyOne.src.includes('blank') &&
          !candyTwo.src.includes('blank') &&
          !candyThree.src.includes('blank'))
      ) {
        return true;
      }
    }
  }
}

function slideCandy() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (!board[r][c].src.includes('blank')) {
        board[ind][c].src = board[r][c].src;
        ind--;
      }
    }
    for (let r = ind; r >= 0; r--) {
      board[r][c].src = './images/blank.png';
    }
  }
}

function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes('blank')) {
      board[0][c].src = './images/' + randomCandy() + '.png';
    }
  }
}
