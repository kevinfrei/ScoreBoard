import { useRecoilCallback, useRecoilValue } from 'recoil';
import { ConeCount } from './Scoring';
import {
  autoScoreState,
  blueScoreState,
  redScoreState,
  remainingConesState,
} from './State';

import './styles/ScoreBoard.css';

export function Scores() {
  const red = useRecoilValue(redScoreState);
  const blue = useRecoilValue(blueScoreState);
  const auto = useRecoilValue(autoScoreState);
  const registerAuto = useRecoilCallback(({ set }) => () => {
    set(autoScoreState, { red, blue });
    set(remainingConesState, (cones: ConeCount) => ({
      auto: { red: 0, blue: 0 },
      normal: { red: 26 + cones.auto.red, blue: 26 + cones.auto.blue },
      beacon: { red: 2, blue: 2 },
    }));
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

export function ConesRemaining(): JSX.Element {
  const cones = useRecoilValue(remainingConesState);
  return (
    <div className="coneboard">
      <div className="header">Cones Remaining</div>
      <div className="header">Red</div>
      <div className="header">Blue</div>
      <div className="label">Autonomous</div>
      <div className="score">{cones.auto.red}</div>
      <div className="score">{cones.auto.blue}</div>
      <div className="label">Regular</div>
      <div className="score">{cones.normal.red}</div>
      <div className="score">{cones.normal.blue}</div>
      <div className="label">Beacons (NYI!)</div>
      <div className="score">{cones.beacon.red}</div>
      <div className="score">{cones.beacon.blue}</div>
    </div>
  );
}

export function Stats(): JSX.Element {
  return (
    <div className="stats">
      <Scores />
      <ConesRemaining />
    </div>
  );
}
