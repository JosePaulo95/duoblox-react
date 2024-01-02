// hook de input
import { useState } from 'react';

import { BlockTouchInput } from '../types/input';

const initialState = {
  type: null,
  x: null,
  y: null,
  direction: null,
};

const useInput = (state: BlockTouchInput = initialState) => {
  const [input, setInput] = useState<BlockTouchInput>(state);

  const consumeInput = (): BlockTouchInput => {
    const currentInput = { ...input };
    setInput(initialState);
    return currentInput;
  };

  const catchBlockInput = (blockInput: BlockTouchInput) => {
    setInput(blockInput);
  };

  return { input, consumeInput, catchBlockInput };
};

export default useInput;
