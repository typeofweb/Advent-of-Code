import { readInput } from './utils';
import { Tuple } from '@bloomberg/record-tuple-polyfill';

type Direction = 'D' | 'L' | 'R' | 'U';
type Position = Tuple<[number, number]>;

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(9);

  const x = data
    .flatMap((line) => {
      const [dir, len] = line.split(' ');
      return Array(Number(len)).fill(dir);
    })
    .reduce(
      ({ H, T, visited }, dir) => {
        const newH = moveDir(H, dir);
        const newT = moveT(T, newH, dir);
        visited.add(newT);
        return { H: newH, T: newT, visited };
      },
      { H: Tuple(0, 0), T: Tuple(0, 0), visited: new Set<Position>() },
    );
  console.log(x.visited.size);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(9);

  const x = data
    .flatMap((line) => {
      const [dir, len] = line.split(' ');
      return Array(Number(len)).fill(dir as Direction);
    })
    .reduce(
      (
        {
          H,
          Ts,
          visited,
        }: { H: Position; Ts: Position[]; visited: Set<Position> },
        dir: Direction,
      ) => {
        const newH = moveDir(H, dir);

        const newTs = Ts.reduce((newTs, T, idx, arr) => {
          if (idx === 0) {
            return [moveT(T, newH, dir)];
          }
          return [...newTs, moveT(T, newTs.at(-1)!, dir)];
        }, [] as Position[]);

        visited.add(newTs.at(-1)!);
        return { H: newH, Ts: newTs, visited };
      },
      {
        H: Tuple(0, 0),
        Ts: Array.from({ length: 9 }, () => Tuple(0, 0)),
        visited: new Set<Position>(),
      },
    );
  console.log(x.visited.size);
})();

function print({ H, T }: { H: Position; T: Position }) {
  const maxX = Math.max(H[0], T[0]);
  const maxY = Math.max(H[1], T[1]);
  const minX = Math.min(H[0], T[0]);
  const minY = Math.min(H[1], T[1]);

  // const w = maxX - minX + 1;
  // const h = maxY - minY + 1;
  const w = 11;
  const h = 11;

  const board = Array(h)
    .fill('.')
    .map(() => Array(w).fill('.'));
  board[T[1] + 5][T[0] + 5] = 'T';
  board[H[1] + 5][H[0] + 5] = 'H';

  console.log(board.map((l) => l.join('')).join('\n'), '\n');
}
function print2({ H, Ts }: { H: Position; Ts: Position[] }) {
  const w = 26;
  const h = 21;

  const x = 11;
  const y = 14;

  const board = Array(h)
    .fill('.')
    .map(() => Array(w).fill('.'));
  Ts.forEach((T, idx) => {
    if (board[T[1] + y][T[0] + x] === '.') {
      board[T[1] + y][T[0] + x] = idx === 9 ? 'T' : idx + 1;
    }
  });
  board[H[1] + y][H[0] + x] = 'H';

  console.log(board.map((l) => l.join('')).join('\n'), '\n');
}

function moveDir(point: Position, dir: Direction): Position {
  switch (dir) {
    case 'U':
      return Tuple(point[0], point[1] - 1);
    case 'D':
      return Tuple(point[0], point[1] + 1);
    case 'R':
      return Tuple(point[0] + 1, point[1]);
    case 'L':
      return Tuple(point[0] - 1, point[1]);
  }
}

function moveT(T: Position, H: Position, dir: Direction): Position {
  if (H === T) {
    return T;
  }
  const diff = sub(H, T);
  const absDiff = abs(diff);

  if (absDiff[0] > 1 || absDiff[1] > 1) {
    return add(T, sign(diff));
  }
  if (absDiff[0] <= 1 && absDiff[1] <= 1) {
    return T;
  }

  const newT = moveDir(T, dir);
  if (newT === H) {
    return T;
  } else {
    return newT;
  }
}

function sub(a: Position, b: Position): Position {
  return Tuple(a[0] - b[0], a[1] - b[1]);
}
function add(a: Position, b: Position): Position {
  return Tuple(a[0] + b[0], a[1] + b[1]);
}
function sign(a: Position): Position {
  return Tuple(Math.sign(a[0]), Math.sign(a[1]));
}
function abs(a: Position): Position {
  return Tuple(Math.abs(a[0]), Math.abs(a[1]));
}
