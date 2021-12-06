import { readInput } from './utils';

const total = (map: Map<any, number>) =>
  [...map.values()].reduce((a, b) => a + b);

const nothing = () => undefined;

const arrayOf =
  <T>(fill: (i: number) => T) =>
  (length: number) =>
  (): T[] =>
    Array.from({ length }, (_, idx) => fill(idx));

/**
 * @description part 1
 */
(async () => {
  const data = (await readInput(6))[0]
    .split(',')
    .map(Number) as InternalTimer[];

  type Count = number;
  type InternalTimer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  type FishesEntry = [InternalTimer, Count];

  const intialFishes = data.reduce((map, timer) => {
    return new Map([...map.entries(), [timer, map.get(timer)! + 1]]);
  }, new Map<InternalTimer, Count>(arrayOf<FishesEntry>((idx) => [idx as InternalTimer, 0])(9)()));

  const fishesMap = arrayOf(nothing)(256)().reduce((fishesMap) => {
    return new Map([
      [0, fishesMap.get(1)!],
      [1, fishesMap.get(2)!],
      [2, fishesMap.get(3)!],
      [3, fishesMap.get(4)!],
      [4, fishesMap.get(5)!],
      [5, fishesMap.get(6)!],
      [6, fishesMap.get(0)! + fishesMap.get(7)!],
      [7, fishesMap.get(8)!],
      [8, fishesMap.get(0)!],
    ] as FishesEntry[]);
  }, intialFishes);

  console.log(total(fishesMap));
})();
