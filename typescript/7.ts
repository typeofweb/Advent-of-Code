import { readInput } from './utils';

import { pipe, A, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
(async () => {
  const data = (await readInput(7))[0]
    .split(',')
    .map(Number)
    .sort((a, b) => a - b);
  const len = data.length;
  const position = data[Math.floor(len / 2)];

  const result = data
    .map((p) => Math.abs(position - p))
    .reduce((a, b) => a + b);

  console.log(result);
})();
/**
 * @description part 2
 */
(async () => {
  const data = (await readInput(7))[0].split(',').map(Number);

  const fuelBurn = (x: number) => (x * (x - 1)) / 2;

  const min = Math.min(...data);
  const max = Math.max(...data);

  const possibilities = A.makeWithIndex(max - min + 1, (i) =>
    pipe(
      data,
      A.map(N.subtract(i + min)),
      A.map(Math.abs),
      A.map(N.add(1)),
      A.map(fuelBurn),
      A.reduce(0 as number, N.add),
    ),
  );

  const leastFuel = Math.min(...possibilities);

  console.log(leastFuel);
})();
