// A simple 'score' type:
export type Score = { red: number; blue: number };

// A junction score: # of codes, plus whether it's owned or capped
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

function isCorner(i: RowCol) {
  return (i.row === 0 || i.row === 6) && (i.col === 0 || i.col === 6);
}

// Calculate the value of each junction:
export function junctionValueRC(row: number, col: number): number {
  if (isCorner({ row, col })) {
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

// Calculate the value of junction (by flat number)
export function junctionValue(pos: number): number {
  const { col, row } = getRC(pos);
  return junctionValueRC(row, col);
}

// This is used to score red/blue independently
export type NeutralScore = { score: number; owned: boolean; capped: boolean };
// Junction score to red score
export function jToRed(junc: JScore): NeutralScore {
  return {
    score: junc.red,
    owned: junc.owner === 'r',
    capped: junc.owner === 'R',
  };
}
// Junction score to blue score
export function jToBlue(junc: JScore): NeutralScore {
  return {
    score: junc.blue,
    owned: junc.owner === 'b',
    capped: junc.owner === 'B',
  };
}

// Given a function to call to get the 'neutral' score for a junction, get the side's score
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

export function redCircuit(getScore: (i: number) => NeutralScore): boolean {
  return connected(getScore, { row: 0, col: 6 }, { row: 6, col: 0 });
}

export function blueCircuit(getScore: (i: number) => NeutralScore): boolean {
  return connected(getScore, { row: 6, col: 6 }, { row: 0, col: 0 });
}

// INTERVIEW QUESTION INCOMING!!!!
function connected(
  getScore: (i: number) => NeutralScore,
  from: RowCol,
  to: RowCol,
): boolean {
  if (getScore(getPos(from)).score === 0 || getScore(getPos(to)).score === 0) {
    return false;
  }
  // Javascript doesn't have 49 bits of data guaranteed in an integer, so strings it is :/
  function emptyVisitor(): string {
    return '1234567abcdefg1234567abcdefg1234567abcdefg1234567';
  }
  function isVisited(flags: string, rc: RowCol): boolean {
    return flags.charAt(getPos(rc)) === 'X';
  }
  function setVisited(flags: string, rc: RowCol): string {
    const pos = getPos(rc);
    return flags.substring(0, pos) + 'X' + flags.substring(pos + 1);
  }
  const start = setVisited(emptyVisitor(), from);
  type WorkItem = { visited: string; rc: RowCol };
  // Seed the worklist with the initial board & starting position:
  const worklist: WorkItem[] = [{ visited: start, rc: from }];
  while (worklist.length > 0) {
    // Pull the back item from the worklist:
    const item = worklist.pop();
    if (item === undefined) {
      window.alert('ERROR!');
      return false;
    }
    // Check to see if this location connect with "to"
    if (connects(item.rc, to)) {
      return true;
    }
    for (let r = -1; r < 2; r++) {
      for (let c = -1; c < 2; c++) {
        const row = item.rc.row + r;
        const col = item.rc.col + c;
        const rc = { row, col };
        if (
          (r === 0 && c === 0) ||
          row < 0 ||
          row > 6 ||
          col < 0 ||
          col > 6 ||
          isVisited(item.visited, rc)
        ) {
          continue;
        }
        // Add this to the worklist, if it's owned/capped
        const score = getScore(getPos(rc));
        if (score.owned || score.capped) {
          worklist.push({ visited: setVisited(item.visited, rc), rc });
        }
      }
    }
    return false;
  }
  return true;
}

// This is a helpful place to deal with corners...
function connects(a: RowCol, b: RowCol): boolean {
  if (Math.abs(a.row - b.row) < 2 && Math.abs(a.col - b.col) < 2) {
    return true;
  }
  if (isCorner(a) || isCorner(b)) {
    const xd = a.row - b.row;
    const yd = a.col - b.col;
    return xd * xd + yd * yd < 6;
  }
  return false;
}
