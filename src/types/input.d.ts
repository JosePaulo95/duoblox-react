export type BlockTouchInput = {
  type: string | null;
  direction: string | null; // 0, 1, 2 ... indicando qual linha ou coluna
  delta: number | null; // -1, 0, 1 indicando a direção
};
