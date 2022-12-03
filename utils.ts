import { A, D, F, O, pipe } from '@mobily/ts-belt';
import * as Fs from 'node:fs/promises';

export const readInput = async (num: number) => {
  const input = await Fs.readFile(`${num}input`, 'utf-8');
  return input.trim().split('\n');
};

export const Atap =
  <A, B>(tapFn: (value: A) => void) =>
  (xs: ReadonlyArray<A>): ReadonlyArray<A> => {
    A.forEach(xs, tapFn);
    return xs;
  };

export const AtapWithIndex =
  <A, B>(tapFn: (idx: number, value: A) => void) =>
  (xs: ReadonlyArray<A>): ReadonlyArray<A> => {
    A.forEachWithIndex(xs, tapFn);
    return xs;
  };

export const Ftap =
  (fn: Function) =>
  <T>(arg: T) => {
    fn(arg);
    return arg;
  };

export const OToBool = <T>(opt: O.Option<T>) =>
  O.match(opt, F.truthy, F.falsy) as [T] extends [never] ? false : true;

export const Otap =
  <T>(tapFn: (value: T) => void) =>
  (option: O.Option<T>): O.Option<T> => {
    O.match(option, tapFn, F.ignore);
    return option;
  };

export const AFlip = <A, B>([a, b]: readonly [A, B]): readonly [B, A] => [b, a];

export const DFlip = <A extends string, B extends string>(obj: Record<A, B>) =>
  pipe(obj, D.toPairs, A.map(AFlip), D.fromPairs) as Record<B, A>;

export const setMerge = <T>(s1: Set<T>, s2: Set<T>): Set<T> =>
  new Set([...s1, ...s2]);

export const setAdd = <T>(s1: Set<T>, v: T): Set<T> => new Set([...s1, v]);

export const isNegative = (x: number) => x < 0;
export const isGreaterThan = (a: number) => (b: number) => b > a;

export function mapGetUnsafe<K, V>(map: Map<K, V>): (key: K) => V;
export function mapGetUnsafe<K extends object, V>(
  map: WeakMap<K, V>,
): (key: K) => V;
export function mapGetUnsafe(map: Map<any, unknown> | WeakMap<any, unknown>) {
  return (key: unknown) => map.get(key)!;
}
