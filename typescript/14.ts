import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { A, D, F, O, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';

const makeTuple = <T extends readonly unknown[]>(args: T) => Tuple(...args);
type Pair = Tuple<readonly [string, string]>;
type InsertionsMap = ReadonlyMap<Pair, string>;
type TemplateMap = ReadonlyMap<Pair, number>;

const getTemplateMap = (template: string): TemplateMap => {
  const tmp = pipe(template, S.split(''));
  return pipe(
    tmp,
    A.zip(A.drop(tmp, 1)),
    A.map((pair) => [makeTuple(pair) as Pair, 1 as number] as const),
    (pairs) => new Map(pairs),
  );
};

(async () => {
  const lines = await readInput(14);

  const [template, _, ...insertions] = lines;

  const insertionsMap = pipe(
    insertions,
    A.map(S.split(' -> ')),
    A.map(
      ([from, to]) =>
        [pipe(from, S.split(''), makeTuple), to] as [
          Tuple<[string, string]>,
          string,
        ],
    ),
    A.reduce(
      new Map(),
      (map: InsertionsMap, element) => new Map([...map.entries(), element]),
    ),
  );

  const step = (templateMap: TemplateMap, no: number): TemplateMap => {
    if (no === 0) {
      return templateMap;
    }

    const newMap = new Map();
    for (const [pair, value] of templateMap) {
      if (insertionsMap.has(pair)) {
        const ins = insertionsMap.get(pair)!;
        const pair1 = Tuple(pair[0], ins);
        const pair2 = Tuple(ins, pair[1]);
        newMap.set(pair1, (newMap.get(pair1) || 0) + value);
        newMap.set(pair2, (newMap.get(pair2) || 0) + value);
      } else {
        newMap.set(pair, (newMap.get(pair) || 0) + value);
      }
    }
    return step(newMap, no - 1);
  };

  const result = step(getTemplateMap(template), 40);
  const entries = Array.from(result.entries());
  const [lhs, rhs] = pipe(
    entries,
    A.reduce(
      [new Map<string, number>(), new Map<string, number>()],
      ([lhs, rhs], [[a, b], value]) => {
        lhs.set(a, (lhs.get(a) || 0) + value);
        rhs.set(b, (rhs.get(b) || 0) + value);
        return [lhs, rhs];
      },
    ),
  );
  console.log(result);
  const allElements = pipe(
    [...new Set([...lhs.keys(), ...rhs.keys()])],
    A.map((element) => {
      const l = lhs.get(element) || 0;
      const r = rhs.get(element) || 0;
      return [element, l > r ? l : r] as const;
    }),
    (xs) => new Map(xs),
  );

  console.log(allElements);
  const min = Math.min(...allElements.values());
  const max = Math.max(...allElements.values());
  console.log(max - min);
})();
