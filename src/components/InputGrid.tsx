import React from 'react';

import styles from '../styles/blocks.module.css';
import { BlockTouchInput } from '../types/input';

type InputGridProps = {
  grid: BlockTouchInput[][] | undefined;
  onInput: (rowIndex: number, columnIndex: number, blockInput: BlockTouchInput) => void; // Tipo da função de callback
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
                      onInput(rowIndex, columnIndex, {
                        type: 'click',
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
