import { connected, connects, NeutralScore } from '../Scoring';

const blueDiagonal = 'X-----/|X2345||1X345||12X45||123X5||1234X|/-----X';
const blueShortestA = 'X-----/|1X345||12X45||123X5||1234X||12345|/-----X';
const blueShortestB = 'X-----/|12345||X2345||1X345||12X45||123X5|/-----X';
const redDiagonal = '/-----X|1234X||123X5||12X45||1X345||X2345|X-----/';
const redShortestA = '/-----X|123X5||12X45||1X345||X2345||12345|X-----/';
const redShortestB = '/-----X|12345||1234X||123X5||12X45||1X345|X-----/';
const blueA = { row: 0, col: 0 };
const blueB = { row: 6, col: 6 };
const redA = { row: 0, col: 6 };
const redB = { row: 6, col: 0 };

function getScore(str: string, pos: number): NeutralScore {
  if (str.charAt(pos) === 'X') {
    return { score: 1, owned: true, capped: false };
  } else {
    return { score: 0, owned: false, capped: false };
  }
}

it('connects testing', () => {
  expect(connects({ row: 0, col: 0 }, { row: 1, col: 1 })).toBeTruthy();
  expect(connects({ row: 0, col: 0 }, { row: 2, col: 1 })).toBeTruthy();
  expect(connects({ row: 0, col: 0 }, { row: 2, col: 1 })).toBeTruthy();

  expect(connects({ row: 0, col: 6 }, { row: 1, col: 5 })).toBeTruthy();
  expect(connects({ row: 0, col: 6 }, { row: 1, col: 4 })).toBeTruthy();
  expect(connects({ row: 0, col: 6 }, { row: 2, col: 5 })).toBeTruthy();

  expect(connects({ row: 6, col: 0 }, { row: 5, col: 1 })).toBeTruthy();
  expect(connects({ row: 6, col: 0 }, { row: 5, col: 2 })).toBeTruthy();
  expect(connects({ row: 6, col: 0 }, { row: 4, col: 1 })).toBeTruthy();

  expect(connects({ row: 6, col: 6 }, { row: 5, col: 5 })).toBeTruthy();
  expect(connects({ row: 6, col: 6 }, { row: 5, col: 4 })).toBeTruthy();
  expect(connects({ row: 6, col: 6 }, { row: 4, col: 5 })).toBeTruthy();
});

function str(s: string): (i: number) => NeutralScore {
  return (i: number) => getScore(s, i);
}
it('diagonals', () => {
  expect(connected(str(blueDiagonal), blueA, blueB)).toBeTruthy();
  expect(connected(str(redDiagonal), redA, redB)).toBeTruthy();
  expect(connected(str(blueDiagonal), blueB, blueA)).toBeTruthy();
  expect(connected(str(redDiagonal), redB, redA)).toBeTruthy();
});

it('simple connected tests', () => {
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

  expect(connected(str(blueShortestA), blueA, blueB)).toBeTruthy();
  expect(connected(str(blueShortestA), blueB, blueA)).toBeTruthy();
  expect(connected(str(blueShortestB), blueA, blueB)).toBeTruthy();
  expect(connected(str(blueShortestB), blueB, blueA)).toBeTruthy();
  expect(connected(str(redShortestA), redA, redB)).toBeTruthy();
  expect(connected(str(redShortestA), redB, redA)).toBeTruthy();
  expect(connected(str(redShortestB), redA, redB)).toBeTruthy();
  expect(connected(str(redShortestB), redB, redA)).toBeTruthy();
});
