import { equals, complement, transpose } from 'ramda';
import { readInput } from './utils';

/**
 * @description part 1
 */
// (async () => {
//   const data = (await readInput(3)).map((line) => line.split(''));

//   const ɣbits = transpose(data).map((bits) =>
//     bits.map(Number).reduce((acc, bit) => acc + (bit || -1), 0) > 0 ? 1 : 0,
//   );
//   const εbits = ɣbits.map((bit) => 1 - bit);

//   const ɣ = Number.parseInt(ɣbits.join(''), 2);
//   const ε = Number.parseInt(εbits.join(''), 2);

//   console.log(ɣ * ε);
// })();

/**
 * @description part 2
 */
(async () => {
  const data = (await readInput(3)).map((line) => line.split('').map(Number));

  function run(
    i: number,
    comparator: (a: number, b: number) => boolean,
    acc: number[][],
  ): number[][] {
    if (acc.length === 1) {
      return acc;
    }

    const mostCommonBit =
      acc.reduce((acc, bits) => acc + (bits[i] || -1), 0) >= 0 ? 1 : 0;
    const filtered = acc.filter((bits) => comparator(bits[i], mostCommonBit));
    return run(i + 1, comparator, filtered);
  }

  const co2bits = run(0, equals, data)[0];
  const o2bits = run(0, complement(equals), data)[0];

  const co2 = Number.parseInt(co2bits.join(''), 2);
  const o2 = Number.parseInt(o2bits.join(''), 2);
  console.log(co2 * o2);
})();
