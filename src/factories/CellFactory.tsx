import Cell from '../components/Cell';
import EmptyBlock from '../components/EmptyBlock';
import Particle from '../components/Particle';
import styles from '../styles/blocks.module.css';
import { Cell as CellType } from '../types/block';
interface BlockFactoryInterface {
  cell: CellType;
  section?: string;
  anim?: string;
  anim_delay?: number;
}

const CellFactory = (props: BlockFactoryInterface) => {
  switch (props.cell.type) {
    case -1:
      return <EmptyBlock></EmptyBlock>;
    case 0:
      return <td className={`${styles.void_block} ${styles.block}`}></td>;
    case 100:
      return <Particle anim={props.anim} />;
    default:
      return (
        <Cell
          key={props.cell.key}
          type={props.cell.type}
          section={props.section}
          anim={props.cell.anim_state}
          anim_delay={props.anim_delay}
        />
      );
  }
};

export default CellFactory;
