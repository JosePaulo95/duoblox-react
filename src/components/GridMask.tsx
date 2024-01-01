import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import BlockFactory from '../factories/BlockFactory';
import styles from '../styles/blocks.module.css';
import { Block } from '../types';

type GridMaskProps = {
  grid: number[][] | undefined;
  section?: string;
};

const Tabuleiro = ({ width, height, numCols, numRows, matriz }) => {
  const celulaWidth = width / numCols; // Calcula a largura de cada célula
  const celulaHeight = height / numRows; // Calcula a altura de cada célula

  const tabuleiro = [];

  // Criar as linhas do tabuleiro
  for (let i = 0; i < numRows; i++) {
    const linha = [];
    // Criar as células da linha
    for (let j = 0; j < numCols; j++) {
      // Pinta a célula apenas se a matriz indica um valor diferente de zero
      if (matriz[i][j] !== 0) {
        linha.push(
          <rect
            key={`${i}-${j}`}
            x={j * celulaWidth} // Posição x baseada na célula
            y={i * celulaHeight} // Posição y baseada na linha
            width={celulaWidth} // Largura de cada célula
            height={celulaHeight} // Altura de cada célula
            fill="white" // Define a cor de preenchimento para células preenchidas
          />,
        );
      } else {
        // Se não tiver um quadrado nesta posição, cria um quadrado transparente
        linha.push(
          <rect
            key={`${i}-${j}`}
            x={j * celulaWidth} // Posição x baseada na célula
            y={i * celulaHeight} // Posição y baseada na linha
            width={celulaWidth} // Largura de cada célula
            height={celulaHeight} // Altura de cada célula
            fill="transparent" // Define a cor de preenchimento para células vazias
          />,
        );
      }
    }
    tabuleiro.push(<g key={i}>{linha}</g>);
  }
  //
  return (
    <svg width={width} height={height}>
      <mask id="myMask">{tabuleiro}</mask>
    </svg>
  );
};

const GridMask = ({ grid, section }: GridMaskProps) => {
  const [tableDimensions, setTableDimensions] = useState({ width: 0, height: 0 });
  const tableRef = useRef<HTMLTableElement>(null); // Especifica o tipo de elemento da ref

  useEffect(() => {
    if (tableRef.current) {
      setTableDimensions({
        width: tableRef.current.offsetWidth,
        height: tableRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <>
      {grid && (
        <>
          <motion.table className={styles.blockGroup} ref={tableRef}>
            <tbody>
              {grid.map((row, i) => (
                <tr key={i}>
                  {row.map((block, j) => (
                    <BlockFactory key={j} type={block} section={section}></BlockFactory>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
          <Tabuleiro
            numCols={grid[0].length}
            numRows={grid.length}
            width={tableDimensions.width}
            height={tableDimensions.height}
            matriz={grid}
          />
        </>
      )}
    </>
  );
};

export default GridMask;
