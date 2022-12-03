import { readInput } from './utils';

import { A, S, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
async () => {
  const data = await readInput(2);

  type Move = 'A' | 'B' | 'C';
  type MoveEncrypted = 'X' | 'Y' | 'Z';

  const mappings = {
    X: 'A',
    Y: 'B',
    Z: 'C',
  } as const;

  const points = {
    A: 1,
    B: 2,
    C: 3,
  } as const;

  const outcomeOfRound = (a: Move, b: Move) => {
    if (a === b) {
      return 3;
    }
    if (a === 'A') {
      if (b === 'B') {
        return 0;
      } else {
        return 6;
      }
    }
    if (a === 'B') {
      if (b === 'C') {
        return 0;
      } else {
        return 6;
      }
    }
    if (a === 'C') {
      if (b === 'A') {
        return 0;
      } else {
        return 6;
      }
    }

    throw new Error(`${a} ${b}`);
  };

  const x = A.map(data, (line) => {
    const [a, bEncrypted] = line.split(' ') as [Move, MoveEncrypted];
    const b = mappings[bEncrypted];
    const result = outcomeOfRound(b, a);
    console.log(result, points[b]);
    return result + points[b];
  }).reduce((acc, result) => acc + result, 0);

  console.log(x);
};

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(2);

  const ROCK = 'A';
  const PAPER = 'B';
  const SCISSORS = 'C';
  type Move = typeof ROCK | typeof PAPER | typeof SCISSORS;

  const LOSE = 'X';
  const DRAW = 'Y';
  const WIN = 'Z';
  type Strategy = typeof LOSE | typeof DRAW | typeof WIN;

  const strategyToPoints = {
    [LOSE]: 0,
    [DRAW]: 3,
    [WIN]: 6,
  } as const;
  const moveToPoints = {
    [ROCK]: 1,
    [PAPER]: 2,
    [SCISSORS]: 3,
  } as const;

  const strategyMoveToMove = {
    [LOSE]: {
      [ROCK]: SCISSORS,
      [PAPER]: ROCK,
      [SCISSORS]: PAPER,
    },
    [DRAW]: {
      [ROCK]: ROCK,
      [PAPER]: PAPER,
      [SCISSORS]: SCISSORS,
    },
    [WIN]: {
      [ROCK]: PAPER,
      [PAPER]: SCISSORS,
      [SCISSORS]: ROCK,
    },
  } as const;

  const x = data
    .map((line) => {
      const [move, strategy] = line.split(' ') as [Move, Strategy];
      const result =
        moveToPoints[strategyMoveToMove[strategy][move]] +
        strategyToPoints[strategy];
      console.log(result);
      return result;
    })
    .reduce((acc, n) => acc + n);

  console.log(x);
})();
