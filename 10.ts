import { readInput } from './utils';

type Operation = { _: 'noop' } | { _: 'addx'; value: number };
type Command = Operation['_'];

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(10);

  const x = data.flatMap((x): Operation[] => {
    const [operation, value] = x.split(' ') as [Command, string?];

    switch (operation) {
      case 'noop':
        return [{ _: 'noop' }];
      case 'addx':
        return [{ _: 'noop' }, { _: 'addx', value: Number(value)! }];
      default: {
        throw new Error(operation);
      }
    }
  });

  function calculate(operations: Operation[]) {
    return operations.reduce((x, operation) => {
      if (operation._ === 'addx') {
        return x + operation.value;
      }
      return x;
    }, 1);
  }

  console.log(
    20 * calculate(x.slice(0, 20 - 1)) +
      60 * calculate(x.slice(0, 60 - 1)) +
      100 * calculate(x.slice(0, 100 - 1)) +
      140 * calculate(x.slice(0, 140 - 1)) +
      180 * calculate(x.slice(0, 180 - 1)) +
      220 * calculate(x.slice(0, 220 - 1)),
  );
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(10);

  const x = data.flatMap((x): Operation[] => {
    const [operation, value] = x.split(' ') as [Command, string?];

    switch (operation) {
      case 'noop':
        return [{ _: 'noop' }];
      case 'addx':
        return [{ _: 'noop' }, { _: 'addx', value: Number(value)! }];
      default: {
        throw new Error(operation);
      }
    }
  });

  const y = x.reduce(
    (acc, operation, position) => {
      const newX = operation._ === 'addx' ? acc.x + operation.value : acc.x;
      const sprite = [acc.x - 1, acc.x, acc.x + 1];

      const newCrt = sprite.includes(position % 40)
        ? [...acc.crt, '#']
        : [...acc.crt, '.'];

      return {
        x: newX,
        crt: newCrt,
      };
    },
    { x: 1, crt: [] as string[] },
  );

  console.log(y.crt.join(''));
})();
