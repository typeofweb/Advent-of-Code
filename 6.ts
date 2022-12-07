import { readInput } from './utils';

import { A, S, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(6);

  const x = data.map((line) =>
    line.split('').reduce((acc, el, idx, arr) => {
      if (acc !== -1) {
        return acc;
      }
      const chars = arr.slice(idx, idx + 4);
      if (new Set(chars).size === 4) {
        return idx + 4;
      }
      return -1;
    }, -1),
  );

  console.log(x);
})();

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(6);

  const x = data.map((line) =>
    line.split('').reduce((acc, el, idx, arr) => {
      if (acc !== -1) {
        return acc;
      }
      const chars = arr.slice(idx, idx + 14);
      if (new Set(chars).size === 14) {
        return idx + 14;
      }
      return -1;
    }, -1),
  );

  console.log(x);
})();
