import { gridPosMove } from '../controller';
import { Grid } from '../types';

const example4x4: Grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

test('calcula a grid apos moveUp', () => {
  const grid: Grid = example4x4;
  const posMove = gridPosMove(
    grid,
    {
      type: 'swipe',
      x: 6,
      y: 1,
      direction: 'up',
    },
    4,
  );
  expect(posMove).toEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 6, 3, 4],
    [5, 10, 7, 8],
    [9, 14, 11, 12],
    [13, 2, 15, 16],
  ]);
});

test('calcula a grid apos moveDown', () => {
  const grid: Grid = example4x4;
  const posMove = gridPosMove(
    grid,
    {
      type: 'swipe',
      x: 7,
      y: 0,
      direction: 'down',
    },
    4,
  );
  expect(posMove).toEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [13, 2, 3, 4],
    [1, 6, 7, 8],
    [5, 10, 11, 12],
    [9, 14, 15, 16],
  ]);
});

test('calcula a grid apos moveLeft', () => {
  const grid: Grid = example4x4;
  const posMove = gridPosMove(
    grid,
    {
      type: 'swipe',
      x: 4,
      y: 3,
      direction: 'left',
    },
    4,
  );
  expect(posMove).toEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 3, 4, 1],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);
});

test('calcula a grid apos moveRight', () => {
  const grid: Grid = example4x4;
  const posMove = gridPosMove(
    grid,
    {
      type: 'swipe',
      x: 4,
      y: 3,
      direction: 'right',
    },
    4,
  );
  expect(posMove).toEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 1, 2, 3],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);
});
