import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import BoardContainer from '../components/BoardContainer';
import CellGridView from '../components/CellGridView';
import GridView from '../components/GridView';
import GroupPieceView from '../components/GroupPieceView';
import InputGrid from '../components/InputGrid';
import PieceView from '../components/PieceView';
import {
  rubikWrapBlock,
  rubikWrapCellGrid,
  rubikWrapGrid,
  wrapGrid,
} from '../controller';
import { cleanInputGrid } from '../factories/InputFactory';
import {
  handleCollision,
  handleFloatingsGoingDown,
  handleMatches,
  handlePieceGoingDown,
  handleResetPiece,
  handleUpdateView,
  handleUserInput,
} from '../handlers';
import useInput from '../input/useInput';
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
  const { consumeInput, catchBlockInput } = useInput();

  useEffect(() => {
    try {
      handleUpdateView(blocks, ticks, dispatch);
      handleMatches(blocks, ticks, dispatch);
      handleResetPiece(blocks, dispatch);
      handleFloatingsGoingDown(blocks, ticks, dispatch);
      handlePieceGoingDown(blocks, ticks, dispatch);
      handleUserInput(consumeInput, dispatch);
    } catch (collision) {
      handleCollision(collision as Error, dispatch);
    }
  }, [ticks]);

  return (
    <BoardContainer>
      <GridView grid={rubikWrapGrid(blocks.limits)}></GridView>
      <PieceView piece={rubikWrapBlock(blocks.particles)}></PieceView>
      <PieceView piece={rubikWrapBlock(blocks.piece)} section="front"></PieceView>
      <GroupPieceView
        pieces={blocks.floating.map(rubikWrapBlock)}
        section="front"
      ></GroupPieceView>
      {/* <PieceView piece={blocks.joinning} section="front"></PieceView> */}
      <GroupPieceView
        pieces={blocks.matching.map(rubikWrapBlock)}
        section="front"
      ></GroupPieceView>
      <CellGridView grid={blocks.rubik_board} section="front"></CellGridView>
      <InputGrid
        grid={rubikWrapGrid(blocks.limits)}
        onInput={catchBlockInput}
      ></InputGrid>
      {/* <GridView grid={displayCurrentGrid(blocks.piece)}></GridView> isso aqui mostra grid do dados ajuda a debugar*/}
    </BoardContainer>
  );
}

export default connector(ContainerBoard);
