import { atom, atomFamily, selector } from 'recoil';
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

// This is the number of total cones remaining
// You use the auto's first, then the normals
export const remainingCones = atom<ConeCount>({
  key: 'cones left',
  default: {
    auto: { red: 5, blue: 5 },
    normal: { red: 26, blue: 26 },
    beacon: { red: 2, blue: 2 },
  },
});

// This is the state for all the junctions (0-48)
export const junctions = atomFamily<JScore, number>({
  key: 'junction',
  default: { red: 0, blue: 0 },
});

// This is the full score calculated before starting to draw
// down from the 'normal' cones
export const autoScore = atom<Score | null>({
  key: 'auto',
  default: null,
});

// Calculate the score for red:
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

// Calculate the score for blue
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
