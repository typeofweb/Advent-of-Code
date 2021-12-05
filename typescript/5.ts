import { readInput } from './utils';

type Point = [x: number, y: number];
type Vent = [from: Point, to: Point];
type VentsMap = number[][];

const arrayOf =
  <T>(length: number, fill: () => T) =>
  (): T[] =>
    Array.from({ length }, fill);
const constant =
  <T>(val: T) =>
  () =>
    val;
const setAt =
  <T>(idx: number, setter: (el: T) => T) =>
  (arr: T[]) =>
    arr.map((el, i) => (i === idx ? setter(el) : el));
const incVentsMap = (y: number, x: number, map: VentsMap): VentsMap =>
  setAt(
    y,
    setAt(x, (el: number) => el + 1),
  )(map);
const move = ([from, to]: Point): number => from + Math.sign(to-from)

const movePoints = ([[fromX, fromY], [toX, toY]]: [Point, Point]): [
  Point,
  Point,
] => {
  return [
    [move([fromX, toX]), move([fromY, toY])],
    [toX, toY],
  ];
};
const repeat =
  (getNewMap: (x: number, y: number, map: VentsMap) => VentsMap) =>
  (map: VentsMap, [[fromX, fromY], [toX, toY]]: [Point, Point]): VentsMap => {
    const newMap = getNewMap(fromX, fromY, map);
    return fromX === toX && fromY === toY
      ? newMap
      : repeat(getNewMap)(
          newMap,
          movePoints([
            [fromX, fromY],
            [toX, toY],
          ]),
        );
  };

const getMapSize = (vents: Vent[]): [number, number] =>
  vents.reduce(
    ([maxX, maxY], [[fromX, fromY], [toX, toY]]) => {
      return [
        Math.max(maxX, fromX + 1, toX + 1),
        Math.max(maxY, fromY + 1, toY + 1),
      ];
    },
    [0, 0],
  );

const readVents = async () => {
  const data = await readInput(5);
  return data.map((row) =>
    row.split(' -> ').map((pos) => pos.split(',').map(Number)),
  ) as Vent[];
};

/**
 * @description part 1 & 2
 */
(async () => {
  const vents = await readVents();
  const [maxX, maxY] = getMapSize(vents);

  const emptyMap: VentsMap = arrayOf(maxY, arrayOf(maxX, constant(0)))();

  const filledMap = vents.reduce(repeat(incVentsMap), emptyMap);

  console.log(filledMap.flat().filter((v) => v > 1).length);
})();
