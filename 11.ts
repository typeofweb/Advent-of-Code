import { readInput } from './utils';

type Operator = '*' | '+';
type Operand =
  | {
      _: 'num';
      value: number;
    }
  | { _: 'old' };

type Monkey = {
  items: number[];
  operator: Operator;
  operand: Operand;
  divisor: number;
  ifTrue: number;
  ifFalse: number;
};

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(11);
  const monkeys = parseMonkeysInput(data);
  const counter = processInput(monkeys, 20, (val) => Math.trunc(val / 3));
  console.log(top2(counter));
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(11);
  const monkeys = parseMonkeysInput(data);

  const congr = Object.values(monkeys)
    .map((m) => m.divisor)
    .filter((el, idx, arr) => arr.indexOf(el) === idx)
    .reduce((a, b) => a * b);

  const counter = processInput(monkeys, 10_000, (val) => val % congr);
  console.log(top2(counter));
})();

function processInput(
  monkeys: Record<number, Monkey>,
  rounds: number,
  fn: (val: number) => number,
) {
  const counter: Record<number, number> = {};
  for (let round = 0; round < rounds; ++round) {
    for (let idx in monkeys) {
      const monkey = monkeys[idx];

      while (monkey.items.length) {
        counter[idx] ??= 0;
        counter[idx]++;

        const item = monkey.items.shift()!;

        const newItem = fn(evaluate(monkey.operator, monkey.operand, item));

        if (newItem % monkey.divisor === 0) {
          monkeys[monkey.ifTrue].items.push(newItem);
        } else {
          monkeys[monkey.ifFalse].items.push(newItem);
        }
      }
    }
  }
  return counter;
}

function top2(counter: Record<number, number>): number {
  return Object.values(counter)
    .sort((b, a) => a - b)
    .slice(0, 2)
    .reduce((a, b) => a * b);
}

function parseMonkeysInput(data: string[]) {
  return data
    .join('\n')
    .split('\n\n')
    .map((monkeyInput): Monkey => {
      const inputs = monkeyInput.split('\n').map((line) => line.trim());
      const items = inputs[1]
        .match(/^Starting items: (.*)$/)?.[1]
        .split(', ')
        .map(Number);
      const operationInput = inputs[2].match(
        /^Operation: new = old ([\+\*]) (\d+|old)$/,
      );
      const operator = operationInput?.[1] as Operator;
      const operand: Operand =
        operationInput?.[2] === 'old'
          ? { _: 'old' }
          : { _: 'num', value: Number(operationInput?.[2]) };

      const divisor = Number(
        inputs?.[3].match(/^Test: divisible by (\d+)$/)?.[1],
      );
      const ifTrue = Number(
        inputs?.[4].match(/^If true: throw to monkey (\d+)$/)?.[1],
      );
      const ifFalse = Number(
        inputs?.[5].match(/^If false: throw to monkey (\d+)$/)?.[1],
      );

      return {
        items: items!,
        operator,
        operand,
        divisor,
        ifTrue,
        ifFalse,
      };
    })
    .reduce<Record<number, Monkey>>((monkeys, monkey, idx) => {
      monkeys[idx] = monkey;
      return monkeys;
    }, Object.create(null));
}

function evaluate(operator: Operator, operand: Operand, old: number) {
  const operandValue = operand._ === 'old' ? old : operand.value;

  if (operator === '+') {
    return old + operandValue;
  } else {
    return old * operandValue;
  }
}
