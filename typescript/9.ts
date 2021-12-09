import { A, D, F, N, O, pipe, S } from '@mobily/ts-belt';
import { Tuple } from '@bloomberg/record-tuple-polyfill';

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
  type Point = Tuple<[x: number, y: number]>;
  type Board = Map<Point, number>;

  const board: Board = pipe(
    await readInput(9),
    A.map(S.split('')),
    A.mapWithIndex((xs, y) => A.mapWithIndex(xs, (h, x) => ({ h, x, y }))),
    A.flat,
    A.reduce(
      new Map(),
      (board: Board, { h, x, y }) =>
        new Map([...board.entries(), [Tuple(x, y), Number(h)]]),
    ),
  );

  const getNeighboursFor = (
    (board: Board) =>
    ([x, y]: Point): readonly Point[] => {
      return pipe(
        [
          // [x - 1, y - 1],
          Tuple(x, y - 1),
          // [x + 1, y - 1],
          Tuple(x - 1, y),
          // [x, y],
          Tuple(x + 1, y),
          // [x - 1, y + 1],
          Tuple(x, y + 1),
          // [x + 1, y + 1],
        ],
        A.filter((p) => board.has(p)),
      );
    }
  )(board);

  const isLowPoint = ((board: Board) => (height: number, point: Point) => {
    return pipe(
      point,
      getNeighboursFor,
      A.map((p) => board.get(p)!),
      A.every(isGreaterThan(height)),
    );
  })(board);

  const lowPoints: readonly Point[] = pipe(
    board,
    (board) => Array.from(board.entries()),
    A.map(([point, height]) => (isLowPoint(height, point) ? [point] : [])),
    A.flat,
    A.reject(A.isEmpty),
  );

  const bucketFill = (board: Board) => (lowPoint: Point) => {
    const memo: WeakMap<Point, Set<Point>> = new WeakMap();

    const work =
      (visited: Set<Point>) =>
      (point: Point): Set<Point> => {
        if (memo.has(point)) {
          return memo.get(point)!;
        }

        if (board.get(point) === 9 || visited.has(point)) {
          memo.set(point, visited);
          return visited;
        }

        const result = pipe(
          getNeighboursFor(point),
          A.map(work(setAdd(visited, point))),
          A.flat,
          A.reduce(visited, setMerge),
        );

        memo.set(point, result);
        return result;
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
