import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import BoardContainer from '../components/BoardContainer';
import GridView from '../components/GridView';
import GroupPieceView from '../components/GroupPieceView';
import InputGrid from '../components/InputGrid';
import PieceView from '../components/PieceView';
import { cleanInputGrid } from '../factories/InputFactory';
import {
  handleCollision,
  handleFloatingsGoingDown,
  handleMatches,
  handlePieceGoingDown,
  handleResetPiece,
  handleUserInput,
} from '../handlers';
// import { keyboardController } from '../input/keyboardInput';
import { BlocksState } from '../types/block';
import { BlockTouchInput } from '../types/input';

type RootState = {
  blocks: BlocksState;
  ticks: number;
};

const mapStateToProps = (state: RootState): RootState => ({
  blocks: state.blocks,
  ticks: state.ticks,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export type ContainerBoardProps = PropsFromRedux;

function ContainerBoard({ blocks, ticks, dispatch }: ContainerBoardProps) {
  const inputGrid = cleanInputGrid();

  const catchBlockInput = (
    rowIndex: number,
    columnIndex: number,
    blockInput: BlockTouchInput,
  ) => {
    console.log('aaa');
    // if (inputGrid[rowIndex] && inputGrid[rowIndex][columnIndex] !== undefined) {
    //   inputGrid[rowIndex][columnIndex] = blockInput;
    // } else {
    //   console.error('Índices fornecidos estão fora dos limites da grid.');
    // }
  };

  useEffect(() => {
    try {
      handleMatches(blocks, ticks, dispatch);
      handleResetPiece(blocks, dispatch);
      handleFloatingsGoingDown(blocks, ticks, dispatch);
      handlePieceGoingDown(blocks, ticks, dispatch);
      handleUserInput(inputGrid, dispatch);
    } catch (collision) {
      handleCollision(collision as Error, dispatch);
    }
  }, [ticks]);

  return (
    <BoardContainer>
      <GridView grid={blocks.limits}></GridView>
      <PieceView piece={blocks.particles}></PieceView>
      <PieceView piece={blocks.piece} section="sides"></PieceView>
      <GroupPieceView pieces={blocks.floating} section="sides"></GroupPieceView>
      <PieceView piece={blocks.joinning} section="sides"></PieceView>
      <GridView grid={blocks.board} section="sides"></GridView>
      <GroupPieceView pieces={blocks.matching} section="sides"></GroupPieceView>
      <PieceView piece={blocks.piece} section="front"></PieceView>
      <GroupPieceView pieces={blocks.floating} section="front"></GroupPieceView>
      <PieceView piece={blocks.joinning} section="front"></PieceView>
      <GridView grid={blocks.board} section="front"></GridView>
      <GroupPieceView pieces={blocks.matching} section="front"></GroupPieceView>
      <InputGrid grid={inputGrid} onInput={catchBlockInput}></InputGrid>
      {/* <GridView grid={displayCurrentGrid(blocks.piece)}></GridView> isso aqui mostra grid do dados ajuda a debugar*/}
    </BoardContainer>
  );
}

export default connector(ContainerBoard);
