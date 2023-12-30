import { motion } from 'framer-motion';

import BlockFactory from '../factories/BlockFactory';
import CellFactory from '../factories/CellFactory';
import styles from '../styles/blocks.module.css';
import { Block } from '../types';
import { CellGrid } from '../types/block';

type CellGridViewProps = {
  grid: CellGrid | undefined;
  section?: string;
};

const CellGridView = ({ grid, section }: CellGridViewProps) => {
  return (
    <>
      {grid && (
        <motion.table className={styles.blockGroup}>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <CellFactory key={j} cell={cell} section={section}></CellFactory>
                ))}
              </tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </>
  );
};

export default CellGridView;
