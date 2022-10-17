import {
  atom,
  atomFamily,
  RecoilState,
  RecoilValueReadOnly,
  selector,
  useRecoilCallback,
} from 'recoil';
import {
  blueCircuit,
  calcSide,
  ConeCount,
  JScore,
  jToBlue,
  jToRed,
  redCircuit,
  Score,
} from './Scoring';

export type ConeState = 'auto' | 'normal' | 'beacon';

export type MyTransactionInterface = {
  get: <T>(recoilVal: RecoilState<T> | RecoilValueReadOnly<T>) => T;
  set: <T>(
    recoilVal: RecoilState<T>,
    valOrUpdater: ((currVal: T) => T) | T,
  ) => void;
  reset: <T>(recoilVal: RecoilState<T>) => void;
};

type FnType<Args extends readonly unknown[], Return> = (
  ...args: Args
) => Return;

// Use my own hook instead of the (no selectors) useRecoilTransaction hook
export function useMyTransaction<Args extends readonly unknown[], Return>(
  fn: (ntrface: MyTransactionInterface) => FnType<Args, Return>,
): FnType<Args, Return> {
  return useRecoilCallback(({ set, reset, snapshot }) => {
    const get = <T>(recoilVal: RecoilState<T> | RecoilValueReadOnly<T>) =>
      snapshot.getLoadable(recoilVal).getValue();
    return fn({ set, reset, get });
  });
}

// This is the number of total cones remaining
// You use the auto's first, then the normals
export const remainingConesState = atom<ConeCount>({
  key: 'cones left',
  default: {
    auto: { red: 10, blue: 10 },
    normal: { red: 0, blue: 0 },
    beacon: { red: 0, blue: 0 },
  },
});

// This is the state for all the junctions (0-48)
export const junctionsStateFunc = atomFamily<JScore, number>({
  key: 'junction',
  default: { red: 0, blue: 0 },
});

// This is the full score calculated before starting to draw
// down from the 'normal' cones
export const autoScoreState = atom<Score | null>({
  key: 'auto',
  default: null,
});

export const inAutoState = selector<boolean>({
  key: 'inAuto',
  get: ({ get }) => get(autoScoreState) === null,
});

export const placeBeaconsState = atom<boolean>({
  key: 'beacons',
  default: false,
});

export const coneState = selector<ConeState>({
  key: 'cone-state',
  get: ({ get }) =>
    get(inAutoState) ? 'auto' : get(placeBeaconsState) ? 'beacon' : 'normal',
});

// Calculate the score for red:
export const redScoreState = selector<number>({
  key: 'red-score',
  get: ({ get }) => {
    const getJunc = (i: number) => jToRed(get(junctionsStateFunc(i)));
    const auto = get(autoScoreState);
    if (auto !== null) {
      return calcSide(getJunc, auto.red) + (redCircuit(getJunc) ? 20 : 0);
    } else {
      return calcSide(getJunc);
    }
  },
});

// Calculate the score for blue
export const blueScoreState = selector<number>({
  key: 'blue-score',
  get: ({ get }) => {
    const getJunc = (i: number) => jToBlue(get(junctionsStateFunc(i)));
    const auto = get(autoScoreState);
    if (auto !== null) {
      return calcSide(getJunc, auto.blue) + (blueCircuit(getJunc) ? 20 : 0);
    } else {
      return calcSide(getJunc);
    }
  },
});

function canPlace(qty: number, jnc: JScore): boolean {
  return qty > 0 && jnc.owner !== 'B' && jnc.owner !== 'R';
}

// Helper function to try to score cones
// These are state maniuplation functions, so they're a little clunky
export function tryBlue(
  { get, set }: MyTransactionInterface,
  junction: RecoilState<JScore>,
): void {
  const cones = get(remainingConesState);
  const cstate = get(coneState);
  const cur = get(junction);
  switch (cstate) {
    case 'auto':
      if (canPlace(cones.auto.blue, cur)) {
        set(junction, { ...cur, blue: cur.blue + 1, owner: 'b' });
        set(remainingConesState, {
          auto: { blue: cones.auto.blue - 1, red: cones.auto.red },
          normal: cones.normal,
          beacon: cones.beacon,
        });
      }
      break;
    case 'normal':
      if (canPlace(cones.normal.blue, cur)) {
        set(junction, { ...cur, blue: cur.blue + 1, owner: 'b' });
        set(remainingConesState, {
          auto: cones.auto,
          normal: { blue: cones.normal.blue - 1, red: cones.normal.red },
          beacon: cones.beacon,
        });
      }
      break;
    case 'beacon':
      if (canPlace(cones.beacon.blue, cur)) {
        set(junction, { ...cur, blue: cur.blue + 1, owner: 'B' });
        set(remainingConesState, {
          auto: cones.auto,
          normal: cones.normal,
          beacon: { blue: cones.beacon.blue - 1, red: cones.beacon.red },
        });
      }
      break;
  }
}

export function tryRed(
  { get, set }: MyTransactionInterface,
  junction: RecoilState<JScore>,
): void {
  const cones = get(remainingConesState);
  const cstate = get(coneState);
  const cur = get(junction);
  switch (cstate) {
    case 'auto':
      // Only do it if we have some blue cones left
      if (canPlace(cones.auto.red, cur)) {
        set(junction, { ...cur, red: cur.red + 1, owner: 'r' });
        set(remainingConesState, {
          auto: { red: cones.auto.red - 1, blue: cones.auto.blue },
          normal: cones.normal,
          beacon: cones.beacon,
        });
      }
      break;
    case 'normal':
      // Normal cones
      if (canPlace(cones.normal.red, cur)) {
        set(junction, { ...cur, red: cur.red + 1, owner: 'r' });
        set(remainingConesState, {
          auto: cones.auto,
          normal: { red: cones.normal.red - 1, blue: cones.normal.blue },
          beacon: cones.beacon,
        });
      }
      break;
    case 'beacon':
      if (canPlace(cones.beacon.red, cur)) {
        set(junction, { ...cur, red: cur.red + 1, owner: 'R' });
        set(remainingConesState, {
          auto: cones.auto,
          normal: cones.normal,
          beacon: { red: cones.beacon.red - 1, blue: cones.beacon.blue },
        });
      }
      break;
  }
}
