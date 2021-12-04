import { pipe } from 'ramda';
import { readInput } from './utils';

const subtract = (a: number, b: number) => a - b;
const gt = (a: number) => (b: number) => b > a;
const isNotNil = <V>(v: V): v is Exclude<V, null | undefined> => v != null;
const length = (xs: unknown[]) => xs.length;
const filter =
  <V>(predicate: (v: V) => boolean) =>
  (values: V[]) =>
    values.filter(predicate);
const drop =
  (count: number) =>
  <V>(xs: V[]) =>
    xs.slice(count);
const zipWith =
  <A, B, C>(fn: (a: A, b: B) => C) =>
  (as: A[]) =>
  (bs: B[]) =>
    as.map((a, i) => fn(a, bs[i])).filter(isNotNil);

/**
 * @description part 1
 */
(async () => {
  const data = (await readInput(1)).map(Number);

  pipe(
    zipWith(subtract)(drop(1)(data)),
    filter(gt(0)),
    length,
    console.log,
  )(data);
})();

/**
 * @description part 2
 */
(async () => {
  const data = (await readInput(1)).map(Number);

  pipe(
    zipWith(subtract)(drop(3)(data)),
    filter(gt(0)),
    length,
    console.log,
  )(data);
})();
