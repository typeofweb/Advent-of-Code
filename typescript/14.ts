import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { A, D, F, O, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';

const makeTuple = <T extends readonly unknown[]>(args: T) => Tuple(...args);
type InsertionsMap = ReadonlyMap<Tuple<[string, string]>, string>;

const getTemplatePairs = (t: string) => {
  const template = pipe(t, S.split(''));
  return pipe(template, A.zip(A.drop(template, 1)));
};

const step = (template: string, insertionsMap: InsertionsMap): string => {
  const templatePairs = getTemplatePairs(template);

  return pipe(
    templatePairs,
    A.map((pair) =>
      insertionsMap.has(makeTuple(pair))
        ? [
            [pair[0], insertionsMap.get(makeTuple(pair))!],
            [insertionsMap.get(makeTuple(pair))!],
            pair[1],
          ]
        : [pair],
    ),
    A.flat,
    A.flat,
    A.join(''),
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
      new Map<Tuple<[string, string]>, string>(),
      (map, element) => new Map([...map.entries(), element]),
    ),
  );

  const solve = (n: number, t = template): string => {
    const result = step(t, insertionsMap);
    return n === 1 ? result : solve(n - 1, result);
  };

  const result = solve(2);

  const elementsByOccurences = pipe(
    result,
    S.split(''),
    A.groupBy(F.identity),
    D.map((xs) => xs?.length || 0),
    D.toPairs,
    A.sort((as, bs) => as[1] - bs[1]),
  );

  // console.log(elementsByOccurences);

  const mostCommon = O.getExn(A.last(elementsByOccurences))[1];
  const leastCommon = O.getExn(A.head(elementsByOccurences))[1];

  // console.log(solve(5).length);
  // console.log(solve(10).length);
  console.log(mostCommon - leastCommon);
})();
