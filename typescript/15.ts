import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { A, D, N, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';
import { Graph, astar } from './astar';

(async () => {
  const input = pipe(
    await readInput(15),
    A.map(S.split('')),
    A.map(A.map(Number)),
  ) as number[][];

  const newInput: number[][] = Array.from({ length: input.length * 5 }, () =>
    Array.from({ length: input.length * 5 }),
  );

  for (let y = 0; y < input.length; ++y) {
    for (let x = 0; x < input.length; ++x) {
      for (let sy = 0; sy < 5; ++sy) {
        for (let sx = 0; sx < 5; ++sx) {
          let value = input[y][x] + sx + sy;
          newInput[y + sy * input.length][x + sx * input.length] =
            value > 9 ? (value % 10) + 1 : value;
        }
      }
    }
  }

  const graph = new Graph(newInput);
  const start = graph.grid[0][0];
  const end = graph.grid[newInput.length - 1][newInput.length - 1];
  const result = astar.search(graph, start, end);
  console.log(result.reduce((acc, node) => acc + node.getCost(), 0));
})();
