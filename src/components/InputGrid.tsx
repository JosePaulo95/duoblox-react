import { useDrag } from '@use-gesture/react';
import React from 'react';

import styles from '../styles/blocks.module.css';
import { Grid } from '../types';
import { BlockTouchInput } from '../types/input';

const InputGrid = ({ grid, onInput }: InputGridProps) => {
  // Função para criar o vinculo do gesto com cada célula
  const bind = (rowIndex, columnIndex) =>
    useDrag(
      ({ down, movement: [mx, my], dragging }) => {
        // Certifique-se de que o gesto é um arraste real, não apenas um movimento do mouse.
        if (down && dragging) {
          const swipeDirection =
            mx > 10
              ? 'right'
              : mx < -10
              ? 'left'
              : my > 10
              ? 'down'
              : my < -10
              ? 'up'
              : '-';
          onInput({
            type: 'swipe',
            x: rowIndex - 1,
            y: columnIndex - 1,
            direction: swipeDirection,
          });
        }
      },
      {
        // Configure para iniciar apenas com arraste (não com o simples movimento do mouse)
        filterTaps: true,
      },
    );

  return (
    <>
      {grid && (
        <table className={styles.blockGroup}>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((block, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={styles.block}
                    // Aplicar o gesto de arrastar diretamente a cada célula
                    {...bind(rowIndex, columnIndex)()}
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
