import { useRecoilValue } from 'recoil';
import { getNameOfJunction, getPos, JScore, RowCol } from './Scoring';
import { junctionsStateFunc, tryBlue, tryRed, useMyTransaction } from './State';

import './styles/Junctions.css';

type classType = { className?: string };
type pieceProps = classType & RowCol;

// Component to display the scores in the terminal
function TerminalScore({ score }: { score: JScore }): JSX.Element {
  if (!score) {
    return <></>;
  }
  if (score.blue !== 0 && score.red !== 0) {
    return <div>ERROR!</div>;
  }
  return <div className="tscore">&#9650; {score.blue + score.red}</div>;
}

// These are the 4 terminals.
function Corner({ row, col }: pieceProps): JSX.Element {
  // increase the score for this corner when clicked
  const score = useRecoilValue(junctionsStateFunc(getPos({ row, col })));
  // Blue is 0,0 & 6,6
  const isBlue = row === col;
  const className = isBlue ? 'blue' : 'red';
  const incScore = useMyTransaction((xact) => () => {
    const jnc = junctionsStateFunc(getPos({ row, col }));
    if (isBlue) {
      tryBlue(xact, jnc);
    } else {
      tryRed(xact, jnc);
    }
  });
  return (
    <div className={`term corner button ${className}`} onClick={incScore}>
      <TerminalScore score={score} />
    </div>
  );
}

// Vertical edge
function VEdge({ className }: classType): JSX.Element {
  return <div className={`term v-edge ${className || ''}`} />;
}

// Horizontal edge
function HEdge({ className }: classType): JSX.Element {
  return <div className={`term h-edge ${className || ''}`} />;
}

// Function to get the owner 'style' to render proprerly
function getOwnStyle(owner?: 'r' | 'R' | 'b' | 'B'): string {
  if (owner === 'r') return ' red';
  if (owner === 'R') return ' red bcn';
  if (owner === 'b') return ' blue';
  if (owner === 'B') return ' blue bcn';
  return '';
}

// This is a 'full' junction (normal junction)
function Full({ className, row, col }: pieceProps): JSX.Element {
  // Get the recoil state object for this junction:
  const jnc = junctionsStateFunc(getPos({ row, col }));
  // Read the actual value:
  const score = useRecoilValue(jnc);
  // Function to score Blue
  const incBlue = useMyTransaction((xact) => () => tryBlue(xact, jnc));
  // Function to score Red
  const incRed = useMyTransaction((xact) => () => tryRed(xact, jnc));
  const cn = `${className || ''}${getOwnStyle(score.owner)}`;
  const isCapped = score.owner === 'B' || score.owner === 'R';
  const mid = isCapped ? <div className="capped">&#x1f451;</div> : <div />;
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
    return <Corner row={row} col={col} />;
  }
  if (row === 0 || row === 6) {
    // Column 3 is the substation column
    if (col === 3) {
      return <HEdge className={row === 0 ? 'blue-depot' : 'red-depot'} />;
    } else {
      return <HEdge />;
    }
  }
  if (col === 0 || col === 6) {
    // Row 3 is the auto stack row
    if (row === 3) {
      return <VEdge className="stack" />;
    } else {
      return <VEdge />;
    }
  }
  const className = getNameOfJunction(row, col);
  return <Full className={className} row={row} col={col} />;
}
