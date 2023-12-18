// 1. Додати інші фігури для Тетрісу
// 2. Стилізуватинові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Центрування фігури коли вона з'являється
// 5. Додати функцію рандомних кольорів для кожної нової фігури

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

// Home work task #5
const TETROMINO_COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'cyan',
  'orange',
  'black'
];

const TETROMINO_NAMES = [
  'O',
  'L',
  // Home work task #1
  'J',
  'S',
  'Z',
  'T',
  'I',
  'P'
];

const TETROMINOES = {
  'O': [
    [1, 1],
    [1, 1]
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // Home work task #1
  'J': [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  'S': [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  'T': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  'I': [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  'P': [
    [1, 1, 1],
    [1, 0, 1]
  ]
};

let playfield;
let tetromino;
// Home work task #5
let previousColor;

// Home work task #5
function getRandomColor() {
  const availableColors = TETROMINO_COLORS.filter(color => color !== previousColor);
  const randomColorIndex = Math.floor(Math.random() * availableColors.length);
  previousColor = availableColors[randomColorIndex];
  return previousColor;
}

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayfield() {
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement('div');
    document.querySelector('.tetris').append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS).fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateTetromino() {
  // Home work task #5
  const tetrominoNames = Object.keys(TETROMINOES);
  // Home work task #3
  const nameTetro = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
  const matrixTetro = TETROMINOES[nameTetro];
  // Home work task #5
  const colorTetro = getRandomColor()

  // Home work task #4
  const columnTetro = Math.floor((PLAYFIELD_COLUMNS - matrixTetro[0].length) / 2);
  const rowTetro = 0;

  //  Home work task #5
  document.documentElement.style.setProperty(`--${nameTetro}-color`, colorTetro);

  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    row: rowTetro,
    column: columnTetro,
    //  Home work task #5
    color: colorTetro
  }
}

generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll('.tetris div');

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrix = tetromino.matrix;

  for (let row = 0; row < tetrominoMatrix.length; row++) {
    for (let column = 0; column < tetrominoMatrix[row].length; column++) {
      const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);

      // Перевіряємо, чи існує елемент з вказаним індексом у масиві cells
      if (cells[cellIndex] && tetrominoMatrix[row][column]) {
        // Очищаємо класи клітинки перед додаванням нового класу
        cells[cellIndex].removeAttribute('class');
        cells[cellIndex].classList.add(name);
      }
    }
  }
}

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute('class');
  });
  drawPlayField();
  drawTetromino();
}

document.addEventListener('keydown', onKeyDown)

function onKeyDown(event) {
  switch (event.key) {
    case 'ArrowDown':
      moveTetrominoDown();
      break;
    case 'ArrowLeft':
      moveTetrominoLeft();
      break;
    case 'ArrowRight':
      moveTetrominoRight();
      break;
  }
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.row -= 1;
    placeTetromino();
  }
  draw();
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column += 1;
  }
  draw();
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column -= 1;
  }
  draw();
}

function isTetrominoTouchingFloor() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      if (tetromino.row + row === PLAYFIELD_ROWS - 1) {
        return true;
      }
    }
  }
  return false;
}

function isOutsideOfGameBoard() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      if (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= PLAYFIELD_ROWS
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;

      const playfieldRow = tetromino.row + row;
      const playfieldColumn = tetromino.column + column;

      // Check if the cell is within the bounds of the playfield
      if (
        playfieldRow >= 0 &&
        playfieldRow < PLAYFIELD_ROWS &&
        playfieldColumn >= 0 &&
        playfieldColumn < PLAYFIELD_COLUMNS
      ) {
        playfield[playfieldRow][playfieldColumn] = tetromino.name;
      }
    }
  }
  generateTetromino();
  draw();
}