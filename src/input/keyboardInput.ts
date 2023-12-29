import { GameInputs } from 'game-inputs';
import Hammer from 'hammerjs';
import { BoardInput } from '../types/input';

export const userController = {
  _current_input_vertical: { delta: 0, index: 0 } as BoardInput,
  _current_input_horizontal: { delta: 0, index: 0 } as BoardInput,

  get input_horizontal(): BoardInput {
    const delta = Number(this._current_input_horizontal.delta);
    const index = Number(this._current_input_horizontal.index);
    this._current_input_horizontal = { delta: 0, index: 0 };
    return { delta, index };
  },
  set input_horizontal({ delta, index }: BoardInput) {
    this._current_input_horizontal = { delta, index };
  },
  get input_vertical(): BoardInput {
    const delta = Number(this._current_input_vertical.delta);
    const index = Number(this._current_input_vertical.index);
    this._current_input_vertical = { delta: 0, index: 0 };
    return { delta, index };
  },
  set input_vertical({ delta, index }: BoardInput) {
    this._current_input_horizontal = { delta, index };
  },
};

const dom = document.documentElement;
const inputs = new GameInputs(dom, {
  preventDefaults: true,
  allowContextMenu: false,
  stopPropagation: true,
  disabled: false,
});

const hammer = new Hammer(dom);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
hammer.get('swipe').set({ threshold: 0.3 });
hammer.on('swipeleft', function (event: HammerInput) {
  userController.current_input_x = -1;
});

hammer.on('swiperight', function (event: HammerInput) {
  userController.current_input_x = 1;
});

// hammer.on('swipeup tap', function (event: HammerInput) {
//   userController.current_input_y = 1;
// });

// hammer.on('swipedown', function (event: HammerInput) {
//   userController.current_input_y = -1;
// });

// Add more event listeners for other gestures as needed
