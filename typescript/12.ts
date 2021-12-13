import { A, N, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';

/**
 * @description part 1 & 2
 */
(async () => {
  type Node = string;
  type Matrix = Map<Node, readonly Node[]>;

  const vertices = pipe(
    await readInput(12),
    A.map(S.split('-')),
  ) as readonly (readonly [Node, Node])[];

  const matrix: Matrix = pipe(
    vertices,
    A.reduce(new Map(), (acc, [from, to]) => {
      const fromV = (acc.get(from) || []).concat(to);
      const toV = (acc.get(to) || []).concat(from);
      acc.set(from, fromV);
      acc.set(to, toV);
      return acc;
    }),
  );

  const start = 'start' as const;
  const end = 'end' as const;

  const canBeVisitedMoreThanOnce = (node: Node) => node.toUpperCase() === node;

  const findPath = (
    matrix: Matrix,
    node: Node,
    path: Node[] = [],
    visited = new Map<Node, number>(),
  ): readonly (readonly Node[])[] => {
    const hasVisitedSmallCaveTwice = [...visited.values()].some((v) => v > 1);

    const allNeighbourNodes = matrix.get(node)!.filter((n) => n !== start);

    if (node === end) {
      return [[...path, end]];
    }

    if (allNeighbourNodes.length === 0) {
      // console.log('DEAD END');
      return [];
    }

    if (
      (visited.has(node) && hasVisitedSmallCaveTwice) ||
      visited.get(node) === 2
    ) {
      // console.log('ALREADY VISITED, SKIPPING…');
      return [];
    }

    const newPath = [...path, node];

    const newVisited = canBeVisitedMoreThanOnce(node)
      ? visited
      : new Map([...visited, [node, (visited.get(node) || 0) + 1]]);

    return allNeighbourNodes.flatMap((n) =>
      findPath(matrix, n, newPath, newVisited),
    );
  };

  const result = pipe(
    findPath(matrix, start),
    A.map(A.join('|')),
    A.uniq,
    A.length,
  );
  console.log({ result });
})();
