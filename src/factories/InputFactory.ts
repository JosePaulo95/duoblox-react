import { configs } from '../configs';
import { wrapGrid } from '../controller';
import { BlockTouchInput } from '../types/input';

export const cleanInputGrid = () => {
  const grid = wrapGrid([[0]], configs.width, configs.height);
  const clean_input = { type: null, direction: null, delta: null } as BlockTouchInput;
  const initial_input_grid = grid.map((row) => row.map(() => ({ ...clean_input })));
  return initial_input_grid;
};
