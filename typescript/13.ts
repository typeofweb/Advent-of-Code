import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { A, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';

type Point = Tuple<[number, number]>;
type Board = readonly Point[];

const print = (points: Board) => {
  const maxX = Math.max(...points.map((p) => p[0])) + 1;
  const maxY = Math.max(...points.map((p) => p[1])) + 1;

  console.log(
    A.makeWithIndex(maxY, (y) =>
      A.makeWithIndex(maxX, (x) =>
        points.includes(Tuple(x, y)) ? '#' : 'o',
      ).join(''),
    ).join('\n'),
  );
};

(async () => {
  const lines = await readInput(13);

  const coordinates: Board = pipe(
    lines,
    A.takeWhile((l) => l.length > 0 && !l.startsWith('fold')),
    A.map(S.split(',')),
    A.map(A.map(Number)),
    A.map((point) => Tuple(...(point as [number, number]))),
  );

  const folds = pipe(
    lines,
    A.drop(coordinates.length + 1),
    A.map(S.replace('fold along ', '')),
    A.map(S.split('=')),
    A.map(([axis, val]) => [axis, Number(val)]),
  ) as readonly (readonly ['y' | 'x', number])[];

  const result = pipe(
    folds,
    // // part 1
    // A.take(1),
    A.reduce(coordinates, (acc: Board, [axis, value]) => {
      // print(acc);
      console.log(`\nFolding by ${axis}=${value}…`);
      return A.uniqBy(
        A.map(acc, ([x, y]) => {
          if (axis === 'y') {
            if (y > value) {
              return Tuple(x, value - (y - value));
            } else {
              return Tuple(x, y);
            }
          } else {
            if (x > value) {
              return Tuple(value - (x - value), y);
            } else {
              return Tuple(x, y);
            }
          }
        }),
        ([x, y]) => `${x}_${y}`,
      );
    }),
  );

  print(result);
})();
