import { readInput } from './utils';

type Tree = {
  [K in string]: number | Tree;
};

type DirSize = {
  [K in string]: {
    size: number;
    sub: DirSize;
  };
};

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(7);

  const x = parseInput(data);
  console.log(
    JSON.stringify(
      countDirs(dirSize({ '/': x.tree }))
        .filter((x) => x <= 100000)
        .reduce((acc, el) => acc + el, 0),
      null,
      2,
    ),
  );
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(7);

  const total = 70000000;
  const required = 30000000;

  const largest = 47052440;
  const free = 22947560;
  const toFree = 7052440;

  const x = parseInput(data);
  console.log(
    JSON.stringify(
      countDirs(dirSize({ '/': x.tree }))
        .sort((a, b) => a - b)
        .find((el) => el >= toFree),
      // .filter((x) => x <= 100000)
      // .reduce((acc, el) => acc + el, 0)
      null,
      2,
    ),
  );
})();

function parseInput(lines: readonly string[]) {
  return lines.reduce(
    (state, line) => {
      if (line.startsWith('$')) {
        // command
        if (line === '$ cd /') {
          return { ...state, dir: [] };
        }
        if (line === '$ cd ..') {
          return { ...state, dir: state.dir.slice(0, -1) };
        }
        if (line === '$ ls') {
          // do nothing
          return state;
        }
        // $ cd X
        const dir = line.slice('$ cd '.length);
        return { ...state, dir: [...state.dir, dir] };
      } else {
        if (line.startsWith('dir')) {
          // do nothing
          return state;
        }
        const split = line.split(' ');
        const size = Number(split[0]);
        const filename = split[1];

        unsafe_set(state.tree, [...state.dir, filename], size);
        return state;
      }
    },
    {
      dir: [] as readonly string[],
      tree: {} as Tree,
    },
  );
}

function unsafe_set(obj: any, path: string[], value: any) {
  path.reduce((acc, key, i) => {
    acc[key] ??= {};
    if (i === path.length - 1) {
      acc[key] = value;
    }
    return acc[key];
  }, obj);
}

function dirSize(tree: Tree): DirSize {
  return Object.entries(tree).reduce((acc, [key, value]) => {
    if (typeof value !== 'number') {
      acc[key] = {
        size: size(value),
        sub: dirSize(value),
      };
    }
    return acc;
  }, {} as DirSize);
}

function size(tree: Tree): number {
  return Object.entries(tree).reduce((acc, [key, value]) => {
    if (typeof value === 'number') {
      return acc + value;
    } else {
      return acc + size(value);
    }
  }, 0);
}

function countDirs(tree: DirSize): number[] {
  return Object.values(tree).flatMap((el) => {
    return [el.size, ...countDirs(el.sub)];
  });
}
