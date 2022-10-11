export type Score = { red: number; blue: number };

export type JScore = Score & {
  // Capital letter means 'beacon'
  owner?: 'r' | 'b' | 'R' | 'B';
};

export type RowCol = { row: number; col: number };

export function getRC(i: number): RowCol {
  const col = Math.round(i % 7);
  const row = Math.round((i - col) / 7);
  return { col, row };
}

export function getPos({ row, col }: RowCol): number {
  return col + row * 7;
}

export function junctionValueRC(row: number, col: number): number {
  if ((col === 0 || col === 6) && (row === 0 || row === 6)) {
    // For terminals, a negative # means check for side
    return -1;
  }
  if (col === 0 || row === 0 || col === 6 || row === 6) {
    // No junctions along the edges
    return 0;
  }
  // Outer ring: ground junctions are 2
  // and low junctions are 3
  if (col === 1 || col === 5) {
    return 2 + ((row + 1) % 2);
  }
  if (row === 1 || row === 5) {
    return 2 + ((col + 1) % 2);
  }
  // Center ground junction
  if (row === 3 && col === 3) {
    return 2;
  }
  // High junctions on the 'center' axes
  if (row === 3 || col === 3) {
    return 5;
  }
  // the last 4 are the medium junctions
  return 4;
}

export function junctionValue(pos: number): number {
  const { col, row } = getRC(pos);
  return junctionValueRC(row, col);
}

export type NeutralScore = { score: number; owned: boolean; capped: boolean };
export function jToRed(junc: JScore): NeutralScore {
  return {
    score: junc.red,
    owned: junc.owner === 'r',
    capped: junc.owner === 'R',
  };
}
export function jToBlue(junc: JScore): NeutralScore {
  return {
    score: junc.blue,
    owned: junc.owner === 'b',
    capped: junc.owner === 'B',
  };
}

export function calcSide(
  getScore: (i: number) => NeutralScore,
  autoValue?: number,
): number {
  const countFinal = typeof autoValue === 'number';
  let total = 0;
  for (let i = 0; i < 49; i++) {
    const jv = getScore(i);
    if (jv.score === 0) {
      continue;
    }
    const val = junctionValue(i);
    if (val < 0) {
      total += jv.score;
    } else {
      total += val * jv.score;
      if (countFinal) {
        if (jv.owned) {
          total += 3;
        } else if (jv.capped) {
          total += 10;
        }
      }
    }
  }
  return total + (countFinal ? autoValue : 0);
}
