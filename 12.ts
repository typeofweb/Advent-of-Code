import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { readInput } from './utils';

type Point = Tuple<[x: number, y: number]>;

const bfs = (x: ReadonlyArray<ReadonlyArray<string>>, S: Point) => {
  const get = (v: Point) => x[v[1]]?.[v[0]];

  const explored = new Set<Point>();
  const queue: Array<Point> = [S];
  const dist: Map<Point, number> = new Map();

  outer: while (queue.length > 0) {
    const v = queue.shift()!;

    const fieldToHeight = (field: string) => {
      return field === 'S'
        ? 'a'.codePointAt(0)!
        : field === 'E'
        ? 'z'.codePointAt(0)!
        : field.codePointAt(0)!;
    };

    const currentField = get(v);
    const currentHeight = fieldToHeight(currentField);

    explored.add(v);

    const adjs = [
      Tuple(v[0], v[1] - 1),
      Tuple(v[0], v[1] + 1),
      Tuple(v[0] - 1, v[1]),
      Tuple(v[0] + 1, v[1]),
    ]
      .filter((point) => get(point) !== undefined)
      .filter((point) => {
        const height = fieldToHeight(get(point));
        return height - 1 <= currentHeight;
      })
      .filter((point) => !explored.has(point));

    // console.log(get(v), '->', adjs.map(get));

    for (const adj of adjs) {
      explored.add(adj);

      dist.set(adj, (dist.get(v) ?? 0) + 1);
      queue.push(adj);

      if (get(adj) === 'E') {
        return dist.get(adj);

        // const map = Array.from({ length: x.length }, () =>
        //   Array.from({ length: x[0].length }, () => '.'),
        // );
        // explored.forEach((e) => (map[e[1]][e[0]] = get(e)));
        // console.log(map.map((line) => line.join('')).join('\n'));
      }
    }
  }
};

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(12);

  const x = data.map((line) => line.split(''));

  const S: Point = x.flatMap((line, y) => {
    const x = line.findIndex((field) => field === 'S');
    return x === -1 ? [] : [Tuple(x, y)];
  })[0]!;

  console.log(bfs(x, S));
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(12);

  const x = data.map((line) => line.split(''));

  const Ss = x.flatMap((line, y) => {
    return line.flatMap((field, x) => (field === 'a' ? [Tuple(x, y)] : []));
  });

  console.log(
    Math.min(...Ss.map((S) => bfs(x, S)!).filter((x) => x !== undefined)),
  );
})();
