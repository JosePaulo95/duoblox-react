export type BlockTouchInput = {
  type: string | null;
  x: number | null;
  y: number | null;
  direction: string | null; // h v
  delta: number | null; // -1, 0, 1 indicando a direção
};
