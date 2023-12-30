import { BlockTouchInput } from '../../types/input';

type PieceMoveDownAction = {
  type: 'piece/move-down';
};

type PieceMoveDownMaxAction = {
  type: 'piece/move-down-max';
};

type PieceMoveRightAction = {
  type: 'piece/move-right';
};

type PieceMoveLeftAction = {
  type: 'piece/move-left';
};

type PieceRotateAction = {
  type: 'piece/rotate';
};

type PieceJoinAction = {
  type: 'piece/join';
};

type BoardTouchAction = {
  type: 'board/touch';
  payload: { x: number; y: number };
};

type FloatingJoinAction = {
  type: 'floating/join';
  payload: number; //index
};

type PieceResetAction = {
  type: 'piece/reset';
};

type BoardCombinationsAction = {
  type: 'board/combinations';
};

type BlocksResetAction = {
  type: 'blocks/reset';
};

type FloatingFallAction = {
  type: 'floating/fall';
};

type CellMove = {
  type: 'cell/move';
  payload: { x: number; y: number };
};

export type BlocksAction =
  | PieceMoveDownAction
  | PieceMoveDownMaxAction
  | PieceMoveRightAction
  | PieceMoveLeftAction
  | PieceRotateAction
  | PieceJoinAction
  | FloatingJoinAction
  | PieceResetAction
  | BoardTouchAction
  | BoardCombinationsAction
  | BlocksResetAction
  | FloatingFallAction
  | CellMove;
