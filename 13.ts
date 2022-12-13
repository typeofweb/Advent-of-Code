import { readInput } from './utils';

type El = number | Array<El>;

const RightOrder = -1;
type RightOrder = typeof RightOrder;
const WrongOrder = 1;
type WrongOrder = typeof WrongOrder;
const Continue = 0;
type Continue = typeof Continue;

function wrap<T>(x: T): T extends number ? [T] : T {
  return (typeof x === 'number' ? [x] : x) as any;
}

function compare(a: El, b: El): RightOrder | WrongOrder | Continue {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a < b) {
      return RightOrder;
    } else if (a > b) {
      return WrongOrder;
    } else {
      return Continue;
    }
  }

  const as = wrap(a);
  const bs = wrap(b);
  for (let i = 0; i < as.length; ++i) {
    if (i >= bs.length) {
      return WrongOrder;
    }
    const ax = as[i];
    const bx = bs[i];
    const comparison = compare(ax, bx);
    if (comparison !== Continue) {
      return comparison;
    }
  }
  if (as.length === bs.length) {
    return Continue;
  }
  return RightOrder;
}

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(13);

  const x = data
    .join('\n')
    .split('\n\n')
    .map(
      (group) => group.split('\n').map((el) => JSON.parse(el)) as [El[], El[]],
    );

  console.log(
    x
      .flatMap(([a, b], idx) => (compare(a, b) !== WrongOrder ? [idx + 1] : []))
      .reduce((a, b) => a + b, 0),
  );
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(13);

  const divider1 = [[2]];
  const divider2 = [[6]];

  const x = data
    .filter((x) => x.trim().length > 0)
    .map((el) => JSON.parse(el) as El[])
    .concat([divider1, divider2]);

  const res = x.sort(compare);
  console.log((res.indexOf(divider1) + 1) * (res.indexOf(divider2) + 1));
})();
