import { readInput } from './utils';

const arrayOf =
  <T>(fill: (i: number) => T) =>
  (length: number) =>
  (): T[] =>
    Array.from({ length }, (_, idx) => fill(idx));

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

const sum = (a: number, b: number) => a + b;

const add = (a: number) => (b: number) => a + b;

const subtract = (a: number) => (b: number) => a - b;

/**
 * @description part 2
 */
(async () => {
  const data = (await readInput(7))[0].split(',').map(Number);

  const fuelBurn = (x: number) => (x * (x - 1)) / 2;

  const min = Math.min(...data);
  const max = Math.max(...data);

  const possibilities = arrayOf((i) => {
    const targetPosition = i + min;
    return data
      .map(subtract(targetPosition))
      .map(Math.abs)
      .map(add(1))
      .map(fuelBurn)
      .reduce(sum);
  })(max - min + 1)();

  const leastFuel = Math.min(...possibilities);
  
  console.log(leastFuel)
})();
