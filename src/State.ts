import { atomFamily, RecoilState, RecoilValueReadOnly, selector } from 'recoil';
import { getRC, JScore, junctionValue } from './Scoring';

export const junctions = atomFamily<JScore, number>({
  key: 'junction',
  default: { red: 0, blue: 0 },
});

export const redScore = selector<number>({
  key: 'red-score',
  get: ({ get }) => {
    let total = 0;
    for (let i = 0; i < 49; i++) {
      const jv = get(junctions(i));
      if (jv.red === 0) {
        continue;
      }
      const val = junctionValue(i);
      if (val < 0) {
        total += jv.red;
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

export const blueScore = selector<number>({
  key: 'blue-score',
  get: ({ get }) => {
    let total = 0;
    for (let i = 0; i < 49; i++) {
      const jv = get(junctions(i));
      if (jv.blue === 0) {
        continue;
      }
      const val = junctionValue(i);
      if (val < 0) {
        total += jv.blue;
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

export type MyTransactionInterface = {
  get: <T>(recoilVal: RecoilState<T> | RecoilValueReadOnly<T>) => T;
  set: <T>(
    recoilVal: RecoilState<T>,
    valOrUpdater: ((currVal: T) => T) | T,
  ) => void;
  reset: <T>(recoilVal: RecoilState<T>) => void;
};
