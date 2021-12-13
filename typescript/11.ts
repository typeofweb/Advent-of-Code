import { A, D, F, N, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';
import { Tuple } from '@bloomberg/record-tuple-polyfill';

type Board = ReadonlyMap<Point, number>;
type Point = Tuple<[x: number, y: number]>;
type BoardEntry = readonly [Point, number];

const print = (board: Board) => {
  pipe(
    Array.from(board.entries()),
    A.reduce([], (acc: number[][], [[x, y], value]) => {
      acc[y] = acc[y] || [];
      acc[y][x] = value;
      return acc;
    }),
    A.map(A.join('')),
    A.join('\n'),
    S.concat('\n'),
    console.log,
  );
  return board;
};

const getNeighboursFor =
  (board: Board) =>
  ([x, y]: Point): readonly Point[] => {
    return pipe(
      [
        Tuple(x - 1, y - 1),
        Tuple(x, y - 1),
        Tuple(x + 1, y - 1),
        Tuple(x - 1, y),
        // [x, y],
        Tuple(x + 1, y),
        Tuple(x - 1, y + 1),
        Tuple(x, y + 1),
        Tuple(x + 1, y + 1),
      ],
      A.filter((p) => board.has(p)),
    );
  };

const step = (board: Board) => {
  return pipe(
    Array.from(board.entries()),
    A.map(([point, value]) => [point, value + 1] as const),
    (xs) => new Map(xs),
    flash,
  );
};

const flash2 = ([point, ...points]: readonly Point[], board: Board): Board => {
  if (!point) {
    return board;
  }

  const newBoard = new Map(board);
  newBoard.set(point, newBoard.get(point)! + 1);

  return flash2(points, newBoard);
};

const flash = (
  board: Board,
  aggPointsWhichFlashed: readonly Point[] = [],
): { board: Board; aggPointsWhichFlashed: readonly Point[] } => {
  const { newEntries, pointsWhichFlashed } = pipe(
    Array.from(board.entries()),
    A.reduce(
      {
        newEntries: [] as readonly BoardEntry[],
        pointsWhichFlashed: [] as readonly Point[],
      },
      (acc, [point, value]) => {
        if (value < 10) {
          return {
            ...acc,
            newEntries: acc.newEntries.concat([[point, value]]),
          };
        }
        return {
          pointsWhichFlashed: acc.pointsWhichFlashed.concat([point]),
          newEntries: acc.newEntries.concat([[point, 0]]),
        };
      },
    ),
  );
  const newBoard = new Map(newEntries);

  if (pointsWhichFlashed.length > 0) {
    const boardAfterFlashes = flash2(
      pointsWhichFlashed.flatMap(getNeighboursFor(newBoard)),
      newBoard,
    );
    return flash(
      boardAfterFlashes,
      aggPointsWhichFlashed.concat(pointsWhichFlashed),
    );
  }
  return {
    aggPointsWhichFlashed,
    board: zeroPoints(board, aggPointsWhichFlashed),
  };
};

const zeroPoints = (board: Board, points: readonly Point[]): Board => {
  return pipe(
    points,
    A.reduce(new Map(board), (map, point) => map.set(point, 0)),
  );
};

/**
 * @description part 1
 */
(async () => {
  const lines: Board = pipe(
    await readInput(11),
    A.map(S.split('')),
    A.mapWithIndex((y, xs) =>
      A.mapWithIndex(xs, (x, v) => [Tuple(x, y), Number(v)] as const),
    ),
    A.flat,
    (entries) => new Map(entries),
  );

  // part 1
  // pipe(
  //   A.make(100, undefined),
  //   A.reduce({ board: lines, flashes: 0 }, ({ board, flashes }) => {
  //     const { aggPointsWhichFlashed, board: newBoard } = step(board);
  //     return {
  //       board: newBoard,
  //       flashes: flashes + aggPointsWhichFlashed.length,
  //     };
  //   }),
  //   (x) => console.log(x.flashes),
  // );

  // part 2
  pipe(
    A.makeWithIndex(1000, (i) => i),
    A.reduce(
      { board: lines, found: undefined as undefined | number },
      ({ board, found }, stepNumber) => {
        if (found) {
          return { board, found };
        }

        const { aggPointsWhichFlashed, board: newBoard } = step(board);

        if (aggPointsWhichFlashed.length === board.size) {
          return {
            board,
            found: stepNumber + 1,
          };
        }
        return {
          board: newBoard,
          found: undefined,
        };
      },
    ),
    (x) => console.log(x.found),
  );
})();
