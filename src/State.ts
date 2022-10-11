import { atom, atomFamily, selector } from 'recoil';
import {
  blueCircuit,
  calcSide,
  JScore,
  jToBlue,
  jToRed,
  redCircuit,
  Score,
} from './Scoring';

export const junctions = atomFamily<JScore, number>({
  key: 'junction',
  default: { red: 0, blue: 0 },
});

export const autoScore = atom<Score | null>({
  key: 'auto',
  default: null,
});

export const redScore = selector<number>({
  key: 'red-score',
  get: ({ get }) => {
    const getJunc = (i: number) => jToRed(get(junctions(i)));
    const auto = get(autoScore);
    if (auto !== null) {
      return calcSide(getJunc, auto.red) + (redCircuit(getJunc) ? 20 : 0);
    } else {
      return calcSide(getJunc);
    }
  },
});

export const blueScore = selector<number>({
  key: 'blue-score',
  get: ({ get }) => {
    const getJunc = (i: number) => jToBlue(get(junctions(i)));
    const auto = get(autoScore);
    if (auto !== null) {
      return calcSide(getJunc, auto.blue) + (blueCircuit(getJunc) ? 20 : 0);
    } else {
      return calcSide(getJunc);
    }
  },
});
