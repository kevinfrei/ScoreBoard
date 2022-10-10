import { atomFamily, RecoilRoot, selector, useRecoilValue } from 'recoil';
import './App.css';

type JScore = {
  red: number;
  blue: number;
  // Capital letter means 'beacon'
  owner?: 'r' | 'b' | 'R' | 'B';
};

const junctions = atomFamily<JScore, number>({
  key: 'junction',
  default: { red: 0, blue: 0 },
});

function junctionValue(pos: number): number {
  const col = Math.round(pos % 7);
  const row = Math.round((pos - col) / 7);
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
    return 1;
  }
  // High junctions on the 'center' axes
  if (row === 3 || col === 3) {
    return 5;
  }
  // the last 4 are the medium junctions
  return 4;
}

const redScore = selector<number>({
  key: 'red-score',
  get: ({ get }) => {
    let total = 0;
    for (let i = 0; i < 49; i++) {
      const jv = get(junctions(i));
      if (jv.red === 0) {
        continue;
      }
      const val = junctionValue(i);
      if (i < 0) {
        const row = Math.round(i % 7);
        const col = Math.round((i - row) / 7);
        total += row === col ? -val * jv.red : 0;
      } else {
        total += val * jv.red;
        if (jv.owner === 'r') {
          total += 3;
        } else if (jv.owner === 'R') {
          total += 10;
        }
      }
    }
    return total;
  },
});

const blueScore = selector<number>({
  key: 'red-score',
  get: ({ get }) => {
    let total = 0;
    for (let i = 0; i < 49; i++) {
      const jv = get(junctions(i));
      if (jv.blue === 0) {
        continue;
      }
      const val = junctionValue(i);
      if (i < 0) {
        const row = Math.round(i % 7);
        const col = Math.round((i - row) / 7);
        total += row === col ? -val * jv.blue : 0;
      } else {
        total += val * jv.blue;
        if (jv.owner === 'b') {
          total += 3;
        } else if (jv.owner === 'B') {
          total += 10;
        }
      }
    }
    return total;
  },
});

function Junction({ row, col }: { row: number; col: number }): JSX.Element {
  const score = useRecoilValue(junctions(row * 7 + col));
  const owner = score.owner === 'r' ? '<=' : score.owner === 'b' ? '=>' : '__';
  return (
    <>
      <span>{`r${score.red}${owner}b${score.blue} ${junctionValue(
        row * 7 + col,
      )}}`}</span>
      {col === 6 ? <br /> : <>&nbsp;</>}
    </>
  );
}

function TheField(): JSX.Element {
  const theJunctions: JSX.Element[] = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      theJunctions.push(<Junction key={`${i}:${j}`} row={i} col={j} />);
    }
  }
  return <div className="board">{theJunctions}</div>;
}

function Scores() {
  const red = useRecoilValue(redScore);
  const blue = useRecoilValue(blueScore);
  return (
    <div>
      <div>Red:{red.toString()}</div>
      <div>Blue:{blue.toString()}</div>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <RecoilRoot>
      <div className="App">
        <TheField />
        <Scores />
      </div>
    </RecoilRoot>
  );
}
