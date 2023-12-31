import { Dispatch } from 'react';

import { configs } from '../configs';
import {
  countCombinations,
  countExactCombinations,
  getGridFromCells,
  hasAnyCombinations,
  isEmptyPiece,
} from '../controller';
import { BlocksState } from '../types/block';
import { BlockTouchInput, BoardInput } from '../types/input';

//TODO considerar o uso de UseCallbacks

const isTimeToMoveDown = (ticks: number) => {
  return ticks % 3 == 0;
};

export const handleUpdateView = async (
  blocks: BlocksState,
  ticks: number,
  dispatch: Dispatch<any>,
) => {
  dispatch({ type: 'board/updateRubikView' });
};

export const handleMatches = async (
  blocks: BlocksState,
  ticks: number,
  dispatch: Dispatch<any>,
): Promise<void> => {
  const matches_count = countExactCombinations(
    getGridFromCells(blocks.board),
    configs.playable_height,
  );
  if (matches_count > 0) {
    dispatch({ type: 'board/combinations' });
    dispatch({ type: 'score/increment', payload: matches_count });
    dispatch({ type: 'audio/play', payload: 'combination' });
  }
};

export const handleFloatingsGoingDown = (
  blocks: any,
  ticks: number,
  dispatch: Dispatch<any>,
) => {
  if (ticks % 2 == 0) {
    dispatch({ type: 'floating/fall' });
    // anim.start('follow');
  }
};

export const handlePieceGoingDown = (
  blocks: any,
  ticks: number,
  dispatch: Dispatch<any>,
) => {
  if (isTimeToMoveDown(ticks) && !isEmptyPiece(blocks.piece)) {
    dispatch({ type: 'piece/move-down' });
    // anim.start('follow');
  }
};

export const handleUserInput = (
  consumeInput: () => BlockTouchInput,
  dispatch: Dispatch<any>,
) => {
  const input = consumeInput();
  if (input.type) {
    // dispatch({ type: 'board/touch', payload: input });
    dispatch({ type: 'cell/move', payload: input });
  }
  // if (input_horizontal.delta > 0) {
  //   dispatch({ type: 'board/move-right', payload: input_horizontal.index });
  //   dispatch({ type: 'audio/play', payload: 'play_move' });
  // }
  // if (input_horizontal.delta < 0) {
  //   dispatch({ type: 'board/move-left', payload: input_horizontal.index });
  //   dispatch({ type: 'audio/play', payload: 'play_move' });
  // }
  // if (input_vertical.delta > 0) {
  //   dispatch({ type: 'board/move-down', payload: input_vertical.index });
  //   dispatch({ type: 'audio/play', payload: 'play_move' });
  // }
  // if (input_vertical.delta < 0) {
  //   dispatch({ type: 'board/move-up', payload: input_vertical.index });
  //   dispatch({ type: 'audio/play', payload: 'play_move' });
  // }
};

export const handleResetPiece = (blocks: any, dispatch: Dispatch<any>) => {
  if (isEmptyPiece(blocks.piece) && blocks.floating.length == 0) {
    dispatch({ type: 'piece/reset' });
    // anim.reset();
    // anim.start('show');
  }
};

export const handleCollision = (collision: Error, dispatch: Dispatch<any>) => {
  switch (collision.message) {
    case 'piece-down-move-collision':
      dispatch({ type: 'audio/play', payload: 'piece_join' });
      dispatch({ type: 'piece/join' });
      break;
    case 'floating-fall-collision':
      dispatch({ type: 'floating/join', payload: collision.name });
      dispatch({ type: 'audio/play', payload: 'piece_join' });
      break;
    case 'piece-side-move-collision':
    case 'piece-rotation-move-collision':
      //add some feedback
      break;
    case 'board-collides-with-limits':
      dispatch({ type: 'blocks/reset' });
      dispatch({ type: 'score/reset' });
      break;
    default:
      throw collision;
  }
};
