import { RecoilRoot, useRecoilCallback, useRecoilValue } from 'recoil';
import { getPos, JScore, junctionValueRC, RowCol } from './Scoring';
import { autoScore, blueScore, junctions, redScore } from './State';

import './App.css';

function TerminalScore({ score }: { score: JScore }): JSX.Element {
  if (!score) {
    return <></>;
  }
  if (score.blue !== 0 && score.red !== 0) {
    return <div>ERROR!</div>;
  }
  return <div className="tscore">&#9650; {score.blue + score.red}</div>;
}

type classType = { className?: string };
type pieceProps = classType & RowCol;

function Corner({ className, row, col }: pieceProps): JSX.Element {
  // increase the score for this corner when clicked
  const score = useRecoilValue(junctions(getPos({ row, col })));
  const incScore = useRecoilCallback(({ set }) => () => {
    const jnc = junctions(getPos({ row, col }));
    if (row === col) {
      set(jnc, (cur) => ({ ...cur, blue: cur.blue + 1 }));
    } else {
      set(jnc, (cur) => ({ ...cur, red: cur.red + 1 }));
    }
  });
  return (
    <div className={`term corner ${className || ''}`} onClick={incScore}>
      <TerminalScore score={score} />
    </div>
  );
}

function VEdge({ className }: classType): JSX.Element {
  return <div className={`term v-edge ${className || ''}`} />;
}

function HEdge({ className }: classType): JSX.Element {
  return <div className={`term h-edge ${className || ''}`} />;
}

function Full({ className, row, col }: pieceProps): JSX.Element {
  // increase the score for this corner when clicked
  const score = useRecoilValue(junctions(getPos({ row, col })));
  const incBlue = useRecoilCallback(({ set }) => () => {
    const jnc = junctions(getPos({ row, col }));
    set(jnc, (cur): JScore => ({ ...cur, blue: cur.blue + 1, owner: 'b' }));
  });
  const incRed = useRecoilCallback(({ set }) => () => {
    const jnc = junctions(getPos({ row, col }));
    set(jnc, (cur): JScore => ({ ...cur, red: cur.red + 1, owner: 'r' }));
  });
  const own = score.owner
    ? score.owner.toLowerCase() === 'r'
      ? ' red'
      : ' blue'
    : '';
  const cn = `${className || ''}${own}`;
  return (
    <div className={`term normal ${cn}`}>
      <div className="redscore">&#9650; {score.red}</div>
      <div className="bluescore">&#9650; {score.blue}</div>
      <div className="redclick" onClick={incRed} />
      <div className="blueclick" onClick={incBlue} />
    </div>
  );
}

function Junction({ row, col }: RowCol): JSX.Element {
  if ((row === 0 || row === 6) && (col === 0 || col === 6)) {
    return (
      <Corner className={row === col ? 'blue' : 'red'} row={row} col={col} />
    );
  }
  if (row === 0 || row === 6) {
    if (col === 3) {
      return <HEdge className={row === 0 ? 'blue-depot' : 'red-depot'} />;
    } else {
      return <HEdge />;
    }
  }
  if (col === 0 || col === 6) {
    if (row === 3) {
      return <VEdge className="stack" />;
    } else {
      return <VEdge />;
    }
  }
  let className = '';
  const score = junctionValueRC(row, col);
  if (score === 2) {
    className = 'ground';
  } else if (score === 3) {
    className = 'low';
  } else if (score === 4) {
    className = 'medium';
  } else if (score === 5) {
    className = 'high';
  }
  return <Full className={className} row={row} col={col} />;
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
  const auto = useRecoilValue(autoScore);
  const registerAuto = useRecoilCallback(({ set }) => () => {
    set(autoScore, { red, blue });
  });
  if (auto === null) {
    return (
      <div className="scoreboard">
        <div>Autonomous period: </div>
        <div>Red: {red.toString()}</div>
        <div>Blue: {blue.toString()}</div>
        <div className="button" onClick={registerAuto}>
          Click to record Auto
        </div>
      </div>
    );
  }
  return (
    <div className="finalscoreboard">
      <div>Autonomous period: </div>
      <div>Red: {auto.red.toString()}</div>
      <div>Blue: {auto.blue.toString()}</div>
      <div>Final: </div>
      <div>Red: {red.toString()}</div>
      <div>Blue: {blue.toString()}</div>
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
