import { connected, NeutralScore } from '../Scoring';

const blueDiagonal = 'X-----/|X2345||1X345||12X45||123X5||1234X|/-----X';
const redDiagonal = '/-----X|1234X||123X5||12X45||1X345||X2345|X-----/';

function getScore(str: string, pos: number): NeutralScore {
  if (str.charAt(pos) === 'X') {
    return { score: 1, owned: true, capped: false };
  } else {
    return { score: 0, owned: false, capped: false };
  }
}

it('diagonals', () => {
  expect(
    connected(
      (i) => getScore(blueDiagonal, i),
      { row: 0, col: 0 },
      { row: 6, col: 6 },
    ),
  ).toBeTruthy();
  
  expect(
    connected(
      (i) => getScore(redDiagonal, i),
      { row: 0, col: 6 },
      { row: 6, col: 0 },
    ),
  ).toBeTruthy();
  
});

it('basic connected tests', () => {
  expect(
    connected(
      (i) => ({ score: 0, owned: false, capped: false }),
      { row: 0, col: 0 },
      { row: 6, col: 6 },
    ),
  ).toBeFalsy();
  expect(
    connected(
      (i) => ({ score: 1, owned: true, capped: false }),
      { row: 0, col: 0 },
      { row: 2, col: 2 },
    ),
  ).toBeTruthy();
});
