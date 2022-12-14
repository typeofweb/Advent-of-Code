import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { readInput } from './utils';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(14);

  const boardData = parseBoard(data);

  const constraints = boardData.reduce(
    (acc, el) => {
      if (el[0] > acc.maxX) acc.maxX = el[0];
      if (el[0] < acc.minX) acc.minX = el[0];
      if (el[1] > acc.maxY) acc.maxY = el[1];
      if (el[1] < acc.minY) acc.minY = el[1];
      return acc;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const board = new Set(boardData);

  console.log(solve(board, constraints));
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(14);

  const boardData = parseBoard(data);

  const constraints = boardData.reduce(
    (acc, el) => {
      if (el[0] > acc.maxX) acc.maxX = el[0];
      if (el[0] < acc.minX) acc.minX = el[0];
      if (el[1] > acc.maxY) acc.maxY = el[1];
      if (el[1] < acc.minY) acc.minY = el[1];
      return acc;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const floorY = constraints.maxY + 2;
  const floor = range(constraints.minX - 10000, constraints.maxY + 10000).map(
    (x) => Tuple(x, floorY),
  );
  constraints.maxY = Infinity;

  const board = new Set(boardData.concat(floor));
  console.log(solve(board, constraints));
})();

function solve(
  board: Set<Tuple<[number, number]>>,
  constraints: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  },
) {
  for (let i = 1; ; ++i) {
    let sandPosition = Tuple(500, 0);
    while (true) {
      // console.log(sandPosition);
      if (sandPosition[1] > constraints.maxY) {
        // console.log('out of bounds');
        // console.log(sandPosition);
        return i - 1;
      }

      const oneDown = Tuple(sandPosition[0], sandPosition[1] + 1);
      if (!board.has(oneDown)) {
        // console.log('oneDown');
        sandPosition = oneDown;
        continue;
      }

      const oneDownLeft = Tuple(sandPosition[0] - 1, sandPosition[1] + 1);
      if (!board.has(oneDownLeft)) {
        // console.log('oneDownLeft');
        sandPosition = oneDownLeft;
        continue;
      }

      const oneDownRight = Tuple(sandPosition[0] + 1, sandPosition[1] + 1);
      if (!board.has(oneDownRight)) {
        // console.log('oneDownRight');
        sandPosition = oneDownRight;
        continue;
      }

      break;
    }

    if (sandPosition === Tuple(500, 0)) {
      return i;
    }
    board.add(sandPosition);
  }
}

function parseBoard(data: string[]) {
  return data.flatMap((line) =>
    line
      .split(' -> ')
      .map((coords) => {
        const [x, y] = coords.split(',');
        return Tuple(Number(x), Number(y));
      })
      .flatMap((from, idx, arr) => {
        if (idx === 0) {
          return [];
        }
        const to = arr[idx - 1];

        const isHorizontal = to[0] === from[0];

        if (isHorizontal) {
          return range(from[1], to[1]).map((y) => Tuple(to[0], y));
        } else {
          return range(from[0], to[0]).map((x) => Tuple(x, to[1]));
        }
      }),
  );
}

function range(ax: number, bx: number) {
  const [a, b] = ax > bx ? [bx, ax] : [ax, bx];
  const diff = Math.abs(b - a);

  return Array.from({ length: diff + 1 }, (_, idx) => a + idx);
}
