import { Tuple } from '@bloomberg/record-tuple-polyfill';
import { readInput } from './utils';

type Point = Tuple<[number, number]>;

const manhattanArea = (point: Point, distance: number) => {
  const points = [];

  const startY = point[1] - distance;
  const startX = point[0];

  // for (let dy = 0; dy <= 2 * distance; ++dy) {
  // const y = startY + dy;

  const y = 2000000;
  const dy = y - startY;
  const numberOfItems = distance - Math.abs(distance - dy);
  for (let x = startX - numberOfItems; x <= startX + numberOfItems; ++x) {
    points.push(x);
  }
  // }
  return points;
};

/**
 * @description part 1
 */
// (async () => {
//   const data = await readInput(15);

//   const x = data
//     .map((line) => {
//       const [_, sx, sy, bx, by] = line.match(
//         /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/,
//       )!;

//       const sensor = Tuple(Number(sx), Number(sy));
//       const beacon = Tuple(Number(bx), Number(by));
//       const distance =
//         Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);

//       return {
//         sensor,
//         beacon,
//         distance,
//       };
//     })
//     .flatMap(({ sensor, beacon, distance }) => {
//       const s = new Set(manhattanArea(sensor, distance));
//       if (sensor[1] === 2000000) s.delete(sensor[0]);
//       if (beacon[1] === 2000000) s.delete(beacon[0]);
//       return [...s];
//     });

//   const set = new Set(x);

//   console.log(set.size);
// })();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(15);

  const manhattan = (
    [ax, ay]: [ax: number, ay: number],
    [bx, by]: [bx: number, by: number],
  ) => Math.abs(ax - bx) + Math.abs(ay - by);

  const sensorsBeacons = data.map((line) => {
    const [_, sx, sy, bx, by] = line.match(
      /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/,
    )!;

    const sensor = Tuple(Number(sx), Number(sy));
    const beacon = Tuple(Number(bx), Number(by));
    return {
      sensor,
      beacon,
    };
  });

  for (let y = 0; y < 4_000_000; ++y) {
    for (let x = 0; x < 4_000_000; ++x) {
      const found = sensorsBeacons.find(
        (sb) => manhattan(sb.sensor, sb.beacon) >= manhattan([x, y], sb.sensor),
      );

      if (!found) {
        console.log({ x, y, r: 4_000_000 * x + y });
        return;
      }

      const range = manhattan(found.sensor, found.beacon);
      const distanceToPoint = manhattan([x, y], found.sensor);
      const dx = range - distanceToPoint;

      x += dx;
    }
  }
})();
