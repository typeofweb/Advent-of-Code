import { pipe, A, S, F, D } from '@mobily/ts-belt';
import { readInput } from './utils';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(2);

  type Direction = 'up' | 'down' | 'forward';

  const parseCommand = (command: string) => {
    return pipe(
      command,
      S.split(' '),
      ([direction, valueStr]) =>
        [direction as Direction, parseInt(valueStr, 10)] as const,
    );
  };

  pipe(
    data,
    A.map(parseCommand),
    A.reduce({ depth: 0, position: 0 }, (acc, command) => {
      return pipe(command, ([direction, value]) => {
        switch (direction) {
          case 'up':
            return D.set(acc, 'depth', acc.depth - value);
          case 'down':
            return D.set(acc, 'depth', acc.depth + value);
          case 'forward':
            return D.set(acc, 'position', acc.position + value);
        }
      });
    }),
    ({ depth, position }) => depth * position,
    console.log,
  );

  // pipe(
  //   reduce(
  //     (acc, command: string) => {
  //       return pipe(
  //         split(' '),
  //         when(pathEq([0], 'forward'), (cmd) =>
  //           over(lensProp('position'), add(Number(path([1])(cmd))), acc),
  //         ),
  //         when(pathEq([0], 'down'), (cmd) =>
  //           over(lensProp('depth'), add(Number(path([1])(cmd))), acc),
  //         ),
  //         when(pathEq([0], 'up'), (cmd) =>
  //           over(lensProp('depth'), subtract(__, Number(path([1])(cmd))), acc),
  //         ),
  //       )(command);
  //     },
  //     { depth: 0, position: 0 },
  //   ),
  //   (acc) => acc.depth * acc.position,
  //   console.log,
  // )(data);
})();

/**
 * @description part 2
 */
// (async () => {
//   const data = await readInput(2);

//   pipe(
//     reduce(
//       (acc, command: string) => {
//         return pipe(
//           split(' '),
//           when(pathEq([0], 'forward'), (cmd) => ({
//             ...acc,
//             position: Number(cmd[1]) + acc.position,
//             depth: acc.depth + Number(cmd[1]) * acc.aim,
//           })),
//           when(pathEq([0], 'down'), (cmd) => ({
//             ...acc,
//             aim: acc.aim + Number(cmd[1]),
//           })),
//           when(pathEq([0], 'up'), (cmd) => ({
//             ...acc,
//             aim: acc.aim - Number(cmd[1]),
//           })),
//         )(command);
//       },
//       { depth: 0, position: 0, aim: 0 },
//     ),
//     (acc) => acc.depth * acc.position,
//     console.log,
//   )(data);
// })();
