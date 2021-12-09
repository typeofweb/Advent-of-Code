import { A, D, F, N, O, pipe, S } from '@mobily/ts-belt';
import {
  readInput,
  setAdd,
  setMerge,
  AtapWithIndex,
  isGreaterThan,
  isNegative,
} from './utils';

/**
 * @description part 1 & 2
 */
(async () => {
  type Point = readonly [x: number, y: number];
  type Board = readonly (readonly number[])[];

  const board: Board = pipe(
    await readInput(9),
    A.map(S.split('')),
    A.map(A.map(Number)),
  );

  const getNeighboursFor = (
    (board: Board) =>
    ([x, y]: Point): readonly Point[] => {
      return pipe(
        [
          // [x - 1, y - 1],
          [x, y - 1],
          // [x + 1, y - 1],
          [x - 1, y],
          // [x, y],
          [x + 1, y],
          // [x - 1, y + 1],
          [x, y + 1],
          // [x + 1, y + 1],
        ],
        A.reject<Point>(A.some(isNegative)),
        A.reject<Point>(([x, y]) => y >= board.length || x >= board[0].length),
      );
    }
  )(board);

  const isLowPoint = ((board: Board) => (height: number, point: Point) => {
    return pipe(
      point,
      getNeighboursFor,
      A.map(([x, y]) => board[y][x]),
      A.every(isGreaterThan(height)),
    );
  })(board);

  const lowPoints = pipe(
    board,
    A.mapWithIndex((xs, y) =>
      A.mapWithIndex(xs, (height, x): Point[] =>
        isLowPoint(height, [x, y]) ? [[x, y]] : [],
      ),
    ),
    A.flat,
    A.flat,
    A.reject(A.isEmpty),
  );

  const hashPoint = ([x, y]: Point): string => `${x}_${y}`;

  const bucketFill = (board: Board) => (lowPoint: Point) => {
    const memo: Record<string, Set<string>> = {};

    const work =
      (visited: Set<string>) =>
      ([x, y]: Point): Set<string> => {
        const hash = hashPoint([x, y]);
        if (memo[hash]) {
          return memo[hash];
        }

        if (board[y][x] === 9 || visited.has(hash)) {
          return (memo[hash] = visited);
        }

        return (memo[hash] = pipe(
          getNeighboursFor([x, y]),
          A.map(work(setAdd(visited, hash))),
          A.flat,
          A.reduce(visited, setMerge),
        ));
      };

    return work(new Set())(lowPoint).size;
  };

  pipe(
    lowPoints,
    AtapWithIndex((i) =>
      console.log(`Processing ${i} out of ${lowPoints.length}…`),
    ),
    A.map(bucketFill(board)),
    A.sort(N.subtract),
    A.reverse,
    A.take(3),
    A.reduce(1 as number, N.multiply),
    console.log,
  );
})();
