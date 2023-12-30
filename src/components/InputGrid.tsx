import React from 'react';

import styles from '../styles/blocks.module.css';
import { BlockTouchInput } from '../types/input';

type InputGridProps = {
  grid: BlockTouchInput[][] | undefined;
  onInput: (blockInput: BlockTouchInput) => void; // Tipo da função de callback
};

const InputGrid = ({ grid, onInput }: InputGridProps) => {
  return (
    <>
      {grid && (
        <table className={styles.blockGroup}>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((block, columnIndex) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                  <td
                    key={columnIndex}
                    className={`${styles.block}`}
                    onClick={() =>
                      onInput({
                        type: 'click',
                        x: rowIndex,
                        y: columnIndex,
                        direction: null,
                        delta: null,
                      })
                    }
                  >
                    <div className={styles.input_front}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default InputGrid;
