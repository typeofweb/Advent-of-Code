import { readInput } from './utils';

import { A, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
(async () => {
  const data = (await readInput(1)).map(Number);

  const x = A.length(
    A.filter(A.zipWith(data, A.drop(data, 1), N.subtract), (x) => x < 0),
  );
  console.log(x);
})();

/**
 * @description part 2
 */
(async () => {
  const data = (await readInput(1)).map(Number);

  const x = A.length(
    A.filter(A.zipWith(data, A.drop(data, 3), N.subtract), (x) => x < 0),
  );

  console.log(x);
})();
