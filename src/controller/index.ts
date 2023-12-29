import { configs } from '../configs';
import { createPiece, emptyGrid } from '../factories/PieceFactory';
import { Block, Grid } from '../types';
import { splitDisconnectedGraphs } from './graph';

export const getCurrentGrid = (block: Block): Grid | undefined => {
  const b = transform(
    block.initial_grid[block.rotations % block.initial_grid.length],
    block.x,
    block.y,
  );
  return b;
};

export const wrapGrid = (
  original_grid: Grid,
  new_width: number,
  new_height: number,
): Grid => {
  if (original_grid.length > new_height || original_grid[0]?.length > new_width) {
    throw new Error('Wrapping a grid into a smaller is not allowed');
  }

  const padding = Math.floor((new_width - original_grid[0]?.length) / 2);
  const grid: number[][] = [];
  for (let i = 0; i < new_height; i++) {
    grid.push([]);
    for (let j = 0; j < new_width; j++) {
      grid[i].push(get(original_grid, i, j - padding));
    }
  }

  return grid;
};

const get = (board: Grid, x: number, y: number): number => {
  if (board[x] && board[x][y]) {
    return board[x][y];
  } else {
    return 0;
  }
};

export const transform = (board: number[][], x: number, y: number): Grid | undefined => {
  const b: number[][] = [];

  for (let i = 0; i < board.length; i++) {
    b.push([]);
    for (let j = 0; j < board[i].length; j++) {
      b[i].push(get(board, i - y, j - x));
    }
  }

  if (
    b.reduce((acc, cur) => acc + cur.reduce((acc1, cur1) => acc1 + cur1, 0), 0) ==
    board.reduce((acc, cur) => acc + cur.reduce((acc1, cur1) => acc1 + cur1, 0), 0)
  ) {
    return b;
  } else {
    return undefined;
  }
};

export const wrap = (board: number[][]): Grid => {
  const wrapped: number[][] = [];
  const width = board.length;
  const height = board[0] ? board[0].length : 0;

  for (let i = 0; i < width + 2; i++) {
    wrapped.push([]);
    for (let j = 0; j < height + 2; j++) {
      wrapped[i].push(0);
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      wrapped[i + 1][j + 1] = board[i][j];
    }
  }

  return wrapped;
};

export const isColliding = (boardA: number[][], boardB: number[][]): boolean | Error => {
  if (!hasSameDimensions(boardA, boardB)) {
    throw new Error('Comparing boards with different sizes is not allowed.');
  }

  for (let i = 0; i < boardA.length; i++) {
    for (let j = 0; j < boardA[i].length; j++) {
      if (boardA[i][j] > 0 && boardB[i][j] > 0) {
        return true;
      }
    }
  }

  return false;
};

export const join = (boardA: number[][], boardB: number[][]): Grid => {
  if (!hasSameDimensions(boardA, boardB)) {
    throw new Error('Joining boards with different sizes is not allowed.');
  }
  if (!isColliding(boardA, boardB)) {
    //throw new Error('Joining colliding boards is not allowed.');
  }

  const join = boardA.map((row) => [...row]); // cria uma cópia de boardA

  for (let i = 0; i < boardB.length; i++) {
    for (let j = 0; j < boardB[i].length; j++) {
      if (boardB[i][j] > 0) {
        join[i][j] = boardB[i][j];
      }
    }
  }

  return join;
};

const hasSameDimensions = (boardA: number[][], boardB: number[][]): boolean => {
  return boardA.length == boardB.length && boardA[0]?.length == boardB[0]?.length;
};

export type BoardState = {
  remaining: Grid;
  floating: Block[];
  matching: Block[];
};

export const splitDisconnected = (grid: Grid): Block[] => {
  const splitted = splitDisconnectedGraphs(grid);
  const blocks: Block[] = splitted.map((i) => {
    return { ...createPiece([i]), anim_state: 'follow' };
  });
  return blocks;
};

const splitMatchRemaining = (board: Grid, playable_height = board.length): { matching: Grid; remaining: Grid } => {
  const rows = board.length;
  const cols = board[0].length;
  let matching = Array.from({ length: rows }, () => Array(cols).fill(0));
  let remaining = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Função auxiliar para verificar se todos os elementos são iguais em uma array
  const allEqual = (arr: number[]): boolean => arr.every(val => val === arr[0] && val !== 0);

  // Marcar combinações nas linhas
  for (let i = 0; i < rows; i++) {
    if (allEqual(board[i])) {
      matching[i] = matching[i].map(() => 10);
    } else {
      remaining[i] = board[i].slice();
    }
  }

  // Marcar combinações nas colunas
  for (let j = 0; j < cols; j++) {
    let col = board.map(row => row[j]).slice(-playable_height);
    if (allEqual(col)) {
      for (let i = 0; i < playable_height; i++) {
        matching[rows - 1 - i][j] = 10;
        remaining[rows - 1 - i][j] = 0;
      }
    }
  }

  // Ajustando 'remaining' com base em 'matching'
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matching[i][j] === 10) {
        remaining[i][j] = 0;
      }
    }
  }

  return {
    matching,
    remaining
  };
}

export const removeMatches = (board: number[][]): BoardState => {
  // const b: Grid = emptyGrid();
  const f: Grid = emptyGrid();
  // const m: Grid = emptyGrid();

  let { matching, remaining } = splitMatchRemaining(board, configs.playable_height)
  // for (let i = board.length - 1; i >= 0; i--) {
  //   if (board[i].every((cell) => cell !== 0)) {
  //     m[i] = board[i].map((i) => 10);
  //   } else {
  //     b[i] = board[i];
  //   }
  // }

  const splitted = splitDisconnected(remaining);
  const grounded = splitted
    .filter((i) => !getCurrentGrid({ ...i, y: i.y + 1 }))
    .reduce((cur, acc) => join(cur, getCurrentGrid(acc) || emptyGrid()), emptyGrid());
  const floating = splitted.filter((i) => getCurrentGrid({ ...i, y: i.y + 1 }));

  // const disc = splitDisconnected(b);

  // for (i = i - 1; i >= 0; i--) {
  //   if (board[i].some((cell) => cell !== 0)) {
  //     break;
  //   }
  // }

  // for (; i >= 0; i--) {
  //   f[i] = board[i];
  // }

  const aux = {
    remaining: grounded,
    floating: floating,
    matching: splitDisconnected(matching),
  };

  return aux;
};

export const removeMatchesMoveDownBlocks = (board: number[][]): Grid => {
  const numRows = board.length;
  const numCols = board[0].length;

  const rowsToRemove: number[] = [];

  for (let row = 0; row < numRows; row++) {
    if (board[row].every((cell) => cell > 0)) {
      rowsToRemove.push(row);
    }
  }

  if (rowsToRemove.length === 0) {
    return board; // no rows to remove, return the original board
  }

  const newBoard: number[][] = [];

  let newRow = numRows - 1; // start at the bottom of the board
  for (let row = numRows - 1; row >= 0; row--) {
    if (!rowsToRemove.includes(row)) {
      newBoard[newRow] = [...board[row]]; // copy the row to its new position
      newRow--;
    }
  }

  // fill the top rows with zeros
  for (let row = 0; row < rowsToRemove.length; row++) {
    newBoard[row] = new Array(numCols).fill(0);
  }

  return newBoard;
};

export const hasAnyCombinations = (board: Grid): boolean => {
  return board.some((row) => row.every((i) => i > 0));
};

let prev: string;

export const countExactCombinations = (board: Grid, playable_height = board.length): number => {
  const cur = board.flat().join('')
  if (cur != prev) {
    prev = cur
  }

  const isUniform = (arr: number[]) => arr.every(val => val === arr[0] && val > 0);

  // Contar linhas uniformes
  const rowCount = board.reduce((count, row) => count + (isUniform(row) ? 1 : 0), 0);

  // Contar colunas uniformes
  const colCount = board[0].reduce((count, _, colIndex) => {
    const column = board.map(row => row[colIndex]).slice(-playable_height);
    return count + (isUniform(column) ? 1 : 0);
  }, 0);

  return rowCount + colCount;
};

export const countCombinations = (board: Grid, piece: Block) => {
  const piece_grid = getCurrentGrid(piece);
  if (!piece_grid) {
    return 0;
  }
  const joinned = join(board, piece_grid);
  const full_combinations = joinned.filter((row) => row.every((i) => i > 0)).length;
  const partial_combinations = joinned.filter(
    (row) => row.filter((j) => j === 0).length === 1,
  ).length;
  return full_combinations + 0.7 * partial_combinations;
};

export const calcAvgHeight = (board: Grid): number => {
  let totalHeight = 0;
  const numCols = board[0].length;

  for (let col = 0; col < numCols; col++) {
    let colHeight = 0;
    for (let row = 0; row < board.length; row++) {
      if (board[row][col] > 0) {
        colHeight = board.length - row;
        break;
      }
    }
    totalHeight += colHeight;
  }

  return totalHeight / numCols;
};

export const clear = (board: Grid): Grid => {
  const b = board;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      b[i][j] = 0;
    }
  }
  return b;
};

export const isEmptyPiece = (piece: Block) => {
  const grid = getCurrentGrid(piece);
  if (grid) {
    return grid.every((row) => row.every((cell) => cell == 0));
  } else {
    return false;
  }
};

export const generateRefillFor = (grid: Grid): Grid => {
  // Criar uma nova matriz com a mesma quantidade de linhas e colunas que a matriz original
  let complement: Grid = [];

  // Percorrer cada linha da matriz original
  for (let i = 0; i < grid.length; i++) {
    // Criar uma nova linha para a matriz complementar
    let newRow: number[] = [];

    // Percorrer cada coluna da linha atual
    for (let j = 0; j < grid[i].length; j++) {
      // Se o valor original for 0, adicionar 1 ao complementar, caso contrário, adicionar 0
      newRow.push(grid[i][j] === 0 ? 1 : 0);
    }

    // Adicionar a nova linha ao complementar
    complement.push(newRow);
  }

  return complement;
};

// Função para embaralhar um array (Fisher-Yates shuffle)
function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para criar o "random bag"
function createRandomBag(types: number[], gridSize: number): number[] {
  let bag: number[] = [];
  while (bag.length < gridSize) {
    // Adiciona uma cópia embaralhada dos tipos ao saco
    bag = bag.concat(shuffleArray([...types]));
  }
  // Corta o saco para ter o tamanho exato da grid
  return bag.slice(0, gridSize);
}

export const fillGridRandomly = (grid: Grid, types: number[]): Grid => {
  // Contar quantas células precisam ser preenchidas (quantidade de 1s na matriz)
  const cellsToFill = grid.flat().filter(x => x === 1).length;

  // Criar um saco aleatório de tipos
  const randomBag = createRandomBag(types, cellsToFill);

  // Criar uma cópia da grid para modificar
  let newGrid: Grid = JSON.parse(JSON.stringify(grid));

  // Índice para acompanhar a posição atual no saco aleatório
  let bagIndex = 0;

  // Preencher a grid com os tipos do saco aleatório
  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < newGrid[i].length; j++) {
      if (newGrid[i][j] === 1) {
        newGrid[i][j] = randomBag[bagIndex++];
      }
    }
  }

  return newGrid;
};
