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
  useMyTransaction,
} from './State';

export function Scores() {
  const red = useRecoilValue(redScoreState);
  const blue = useRecoilValue(blueScoreState);
  const auto = useRecoilValue(autoScoreState);
  if (auto === null) {
    return (
      <div className="scoreboard">
        <div className="spacer" />
        <div className="header red">Red</div>
        <div className="header blue">Blue</div>
        <div className="label">Autonomous period</div>
        <div className="score red">{red}</div>
        <div className="score blue">{blue}</div>
      </div>
    );
  }
  return (
    <div className="scoreboard">
      <div className="spacer" />
      <div className="header red">Red</div>
      <div className="header blue">Blue</div>
      <div className="label inactive">Autonomous period</div>
      <div className="score inactive red">{auto.red}</div>
      <div className="score inactive blue">{auto.blue}</div>
      <div className="label">Final</div>
      <div className="score red">{red}</div>
      <div className="score blue">{blue}</div>
    </div>
  );
}

export function ConesRemaining(): JSX.Element {
  const cones = useRecoilValue(remainingConesState);
  const inactive = useRecoilValue(inAutoState) ? '' : ' inactive';
  return (
    <div className="coneboard">
      <div className="header">Cones Remaining</div>
      <div />
      <div className="header">Red</div>
      <div className="header">Blue</div>
      <div className={`label${inactive}`}>Autonomous</div>
      <div />
      <div className={`score${inactive}`}>{cones.auto.red}</div>
      <div className={`score${inactive}`}>{cones.auto.blue}</div>
      <div className="label">Regular</div>
      <div />
      <div className="score">{cones.normal.red}</div>
      <div className="score">{cones.normal.blue}</div>
      <div className="label">Beacons</div>
      <div />
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
  const registerAuto = useMyTransaction(({ set, get }) => () => {
    set(autoScoreState, { red: get(redScoreState), blue: get(blueScoreState) });
    set(remainingConesState, (cones: ConeCount) => ({
      auto: { red: 0, blue: 0 },
      normal: { red: 21 + cones.auto.red, blue: 21 + cones.auto.blue },
      beacon: { red: 2, blue: 2 },
    }));
  });
  const beaconOrAuto = inAuto ? (
    <div className="auto button" onClick={registerAuto}>
      Record Auto
    </div>
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
      {beaconOrAuto}
      <div className="button" onClick={clickReset}>
        Reset Game!
      </div>
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
