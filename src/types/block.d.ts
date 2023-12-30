import { Grid } from '.';

export type Block = {
  key: number;
  initial_grid: Grid[];
  x: number;
  y: number;
  rotations: number;
  anim_state: string;
};

export type BlocksState = {
  piece: Block;
  board: CellGrid;
  limits: Grid;
  joinning: Block;
  floating: Block[];
  matching: Block[];
  particles: Block;
};

export type Cell = {
  key?: number;
  type: number;
  anim_state: string;
};

export type CellGrid = Cell[][];
