import { atom, atomFamily, selector } from 'recoil';
import { calcSide, JScore, jToBlue, jToRed, Score } from './Scoring';

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
    return auto !== null ? calcSide(getJunc, auto.red) : calcSide(getJunc);
  },
});

export const blueScore = selector<number>({
  key: 'blue-score',
  get: ({ get }) => {
    const getJunc = (i: number) => jToBlue(get(junctions(i)));
    const auto = get(autoScore);
    return auto !== null ? calcSide(getJunc, auto.blue) : calcSide(getJunc);
  },
});
