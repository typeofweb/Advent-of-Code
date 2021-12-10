import { A, B, D, F, G, N, pipe, S } from '@mobily/ts-belt';
import { Atap, readInput } from './utils';

const OPENING = '([{<';
const CLOSING = ')]}>';

const isOpening = (char: string) => OPENING.includes(char);
const isClosing = (char: string) => CLOSING.includes(char);
const close = (char: string) => CLOSING.at(OPENING.indexOf(char));
const open = (char: string) => OPENING.at(CLOSING.indexOf(char));

const log = (prefix: string) => (val: unknown) => console.log(prefix, val);

const findFirstInvalid = (str: string) =>
  pipe(
    str,
    S.split(''),
    A.reduce(
      {
        stack: [],
        found: undefined,
      } as {
        stack: readonly string[];
        found?: string | undefined;
      },
      ({ found, stack }, char) => {
        // console.log({ stack, char });
        if (found) {
          return { stack, found };
        }
        if (isOpening(char)) {
          return { stack: A.concat([char], stack) };
        }
        if (A.head(stack) === open(char)) {
          return { stack: A.drop(stack, 1) };
        }
        return { stack, found: char };
      },
    ),
  );

/**
 * @description part 1
 */
(async () => {
  const lines = await readInput(10);

  const POINTS: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };
  const getPoint = (key: string | undefined) => POINTS[key!];

  pipe(
    lines,
    A.map(findFirstInvalid),
    A.map(D.prop('found')),
    A.filter((x) => !!x),
    A.map(getPoint),
    A.reduce(0 as number, N.add),
    log('1:'),
  );
})();

/**
 * @description part 2
 */
(async () => {
  const lines = await readInput(10);

  const POINTS = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  } as Record<string, number>;
  const getPoint = (key: string | undefined) => POINTS[key!];

  pipe(
    lines,
    A.map(findFirstInvalid),
    A.filter((x) => !!x.found),
    A.map((x) =>
      pipe(
        x,
        D.prop('stack'),
        A.map(close),
        A.map(getPoint),
        A.reduce(0 as number, (acc, x) => 5 * acc + x),
      ),
    ),
    A.sort(N.subtract),
    (xs) => xs[Math.floor(xs.length / 2)],
    log('2:'),
  );
})();
