import * as Fs from 'node:fs/promises';
import {
  add,
  head,
  lensPath,
  lensProp,
  nth,
  over,
  pathEq,
  pipe,
  reduce,
  set,
  split,
  when,
  apply,
  T,
  path,
  subtract,
  tap,
  __,
} from 'ramda';
import { readInput } from './utils';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(2);

  pipe(
    reduce(
      (acc, command: string) => {
        return pipe(
          split(' '),
          when(pathEq([0], 'forward'), (cmd) =>
            over(lensProp('position'), add(Number(path([1])(cmd))), acc),
          ),
          when(pathEq([0], 'down'), (cmd) =>
            over(lensProp('depth'), add(Number(path([1])(cmd))), acc),
          ),
          when(pathEq([0], 'up'), (cmd) =>
            over(lensProp('depth'), subtract(__, Number(path([1])(cmd))), acc),
          ),
        )(command);
      },
      { depth: 0, position: 0 },
    ),
    (acc) => acc.depth * acc.position,
    console.log,
  )(data);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(2);

  pipe(
    reduce(
      (acc, command: string) => {
        return pipe(
          split(' '),
          when(pathEq([0], 'forward'), (cmd) => ({
            ...acc,
            position: Number(cmd[1]) + acc.position,
            depth: acc.depth + Number(cmd[1]) * acc.aim,
          })),
          when(pathEq([0], 'down'), (cmd) => ({
            ...acc,
            aim: acc.aim + Number(cmd[1]),
          })),
          when(pathEq([0], 'up'), (cmd) => ({
            ...acc,
            aim: acc.aim - Number(cmd[1]),
          })),
        )(command);
      },
      { depth: 0, position: 0, aim: 0 },
    ),
    (acc) => acc.depth * acc.position,
    console.log,
  )(data);
})();
