import { useRecoilCallback, useRecoilValue } from 'recoil';
import { getPos, JScore, junctionValueRC, RowCol } from './Scoring';
import {
  coneState,
  inAutoState,
  junctionsStateFunc,
  remainingConesState,
  tryBlue,
  tryRed,
} from './State';

import './styles/Junctions.css';

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
  const score = useRecoilValue(junctionsStateFunc(getPos({ row, col })));
  const cones = useRecoilValue(remainingConesState);
  const inAuto = useRecoilValue(inAutoState);
  const incScore = useRecoilCallback(({ set }) => () => {
    const jnc = junctionsStateFunc(getPos({ row, col }));
    if (row === col) {
      tryBlue(set, jnc, cones, inAuto ? 'auto' : 'normal');
    } else {
      tryRed(set, jnc, cones, inAuto ? 'auto' : 'normal');
    }
  });
  return (
    <div className={`term corner button ${className || ''}`} onClick={incScore}>
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

function getOwnStyle(owner?: 'r' | 'R' | 'b' | 'B'): string {
  switch (owner) {
    case 'r':
      return ' red';
    case 'R':
      return ' red bcn';
    case 'b':
      return ' blue';
    case 'B':
      return ' blue bcn';
    default:
      return '';
  }
}

function Full({ className, row, col }: pieceProps): JSX.Element {
  // increase the score for this corner when clicked
  const score = useRecoilValue(junctionsStateFunc(getPos({ row, col })));
  const cones = useRecoilValue(remainingConesState);
  const cstate = useRecoilValue(coneState);
  const incBlue = useRecoilCallback(({ set }) => () => {
    const jnc = junctionsStateFunc(getPos({ row, col }));
    tryBlue(set, jnc, cones, cstate);
  });
  const incRed = useRecoilCallback(({ set }) => () => {
    const jnc = junctionsStateFunc(getPos({ row, col }));
    tryRed(set, jnc, cones, cstate);
  });
  const cn = `${className || ''}${getOwnStyle(score.owner)}`;
  const isCapped = score.owner === 'B' || score.owner === 'R';
  const mid = isCapped ? <div>X</div> : <div/>;
  return (
    <div className={`term normal ${cn}`}>
      <div className="redscore button" onClick={incRed}>
        &#9650; {score.red}
      </div>
      {mid}
      <div className="bluescore button" onClick={incBlue}>
        &#9650; {score.blue}
      </div>
    </div>
  );
}

export function Junction({ row, col }: RowCol): JSX.Element {
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
