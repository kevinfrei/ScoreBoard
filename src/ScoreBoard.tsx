import { useRecoilCallback, useRecoilValue } from 'recoil';
import { autoScore, blueScore, redScore } from './State';

import './styles/ScoreBoard.css';

export function Scores() {
  const red = useRecoilValue(redScore);
  const blue = useRecoilValue(blueScore);
  const auto = useRecoilValue(autoScore);
  const registerAuto = useRecoilCallback(({ set }) => () => {
    set(autoScore, { red, blue });
  });
  if (auto === null) {
    return (
      <div className="scoreboard">
        <div />
        <div className="header">Red</div>
        <div className="header">Blue</div>
        <div className="label">Autonomous period</div>
        <div className="score">{red}</div>
        <div className="score">{blue}</div>
        <div className="auto button" onClick={registerAuto}>
          Click to record Auto
        </div>
      </div>
    );
  }
  return (
    <div className="scoreboard">
      <div />
      <div className="header">Red</div>
      <div className="header">Blue</div>
      <div className="label">Autonomous period</div>
      <div className="score">{auto.red}</div>
      <div className="score">{auto.blue}</div>
      <div className="label">Final</div>
      <div className="score">{red}</div>
      <div className="score">{blue}</div>
    </div>
  );
}
