import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { ConeCount } from './Scoring';
import {
  autoScoreState,
  blueScoreState,
  inAutoState,
  junctionsStateFunc,
  placeBeaconsState,
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
      normal: { red: 21 + cones.auto.red, blue: 21 + cones.auto.blue },
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
      <div className="label inactive">Autonomous period</div>
      <div className="score inactive">{auto.red}</div>
      <div className="score inactive">{auto.blue}</div>
      <div className="label">Final</div>
      <div className="score">{red}</div>
      <div className="score">{blue}</div>
    </div>
  );
}

export function ConesRemaining(): JSX.Element {
  const cones = useRecoilValue(remainingConesState);
  const inactive = useRecoilValue(inAutoState) ? '' : ' inactive';
  return (
    <div className="coneboard">
      <div className="header">Cones Remaining</div>
      <div className="header">Red</div>
      <div className="header">Blue</div>
      <div className={`label${inactive}`}>Autonomous</div>
      <div className={`score${inactive}`}>{cones.auto.red}</div>
      <div className={`score${inactive}`}>{cones.auto.blue}</div>
      <div className="label">Regular</div>
      <div className="score">{cones.normal.red}</div>
      <div className="score">{cones.normal.blue}</div>
      <div className="label">Beacons</div>
      <div className="score">{cones.beacon.red}</div>
      <div className="score">{cones.beacon.blue}</div>
    </div>
  );
}

function ButtonPanel(): JSX.Element {
  const [placing, setPlacing] = useRecoilState(placeBeaconsState);
  const text = placing ? 'Place Cones' : 'Place Beacons';
  const flipBeacon = () => setPlacing(!placing);
  const inAuto = useRecoilValue(inAutoState);
  const beacon = inAuto ? (
    <div />
  ) : (
    <div className="button beacon" onClick={flipBeacon}>
      {text}
    </div>
  );
  const clickReset = useRecoilCallback(({ reset }) => () => {
    reset(remainingConesState);
    reset(autoScoreState);
    reset(placeBeaconsState);
    for (let i = 0; i < 49; i++) {
      reset(junctionsStateFunc(i));
    }
  });
  return (
    <div id="button-panel">
      <div className="button" onClick={clickReset}>
        Reset Game!
      </div>
      {beacon}
    </div>
  );
}

export function Stats(): JSX.Element {
  return (
    <div className="stats">
      <Scores />
      <ButtonPanel />
      <ConesRemaining />
    </div>
  );
}
