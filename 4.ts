import { readInput } from './utils';

import { A, S, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(4);
  const x = data
    .map((line) => {
      const [a, b] = line.split(',');
      const [startA, endA] = a.split('-').map(Number);
      const [startB, endB] = b.split('-').map(Number);
      return overlapCompletely(startA, endA, startB, endB);
    })
    .reduce((acc, el) => acc + (el ? 1 : 0), 0);
  console.log(x);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(4);
  const x = data
    .map((line) => {
      const [a, b] = line.split(',');
      const [startA, endA] = a.split('-').map(Number);
      const [startB, endB] = b.split('-').map(Number);
      return overlapAtAll(startA, endA, startB, endB);
    })
    .reduce((acc, el) => acc + (el ? 1 : 0), 0);
  console.log(x);
})();

const overlapCompletely = (a1: number, a2: number, b1: number, b2: number) => {
  return (a1 <= b1 && a2 >= b2) || (b1 <= a1 && b2 >= a2);
};

const overlapAtAll = (a1: number, a2: number, b1: number, b2: number) => {
  return (
    (a1 <= b1 && a2 <= b2 && a2 >= b1) ||
    (a1 < b1 && a2 >= b2) ||
    (a1 >= b1 && a1 <= b2) ||
    (a2 >= b1 && a2 <= b2)
  );
};
