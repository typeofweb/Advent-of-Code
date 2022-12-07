import { readInput } from './utils';

import { A, S, N } from '@mobily/ts-belt';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(5, false);
  const { crates, instructions } = parseInput(data);

  const x = instructions.reduce((crates, instr) => {
    for (let i = 0; i < instr.num; ++i) {
      crates[instr.to - 1].push(crates[instr.from - 1].pop()!);
    }
    return crates;
  }, crates);

  console.log(x.map((el) => el.at(-1)).join(''));
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(5, false);
  const { crates, instructions } = parseInput(data);

  const x = instructions.reduce((crates, instr) => {
    console.log(crates);
    crates[instr.to - 1].push(...crates[instr.from - 1].slice(-instr.num));
    crates[instr.from - 1] = crates[instr.from - 1].slice(0, -instr.num);
    return crates;
  }, crates);

  console.log(x.map((el) => el.at(-1)).join(''));
})();

function parseInput(lines: string[]) {
  const instructionsStartIndex = lines.findIndex((line) => line.trim() === '');
  const [crates, instructions] = [
    lines.slice(0, instructionsStartIndex),
    lines.slice(instructionsStartIndex + 1),
  ];
  return {
    crates: parseCrates(crates),
    instructions: parseInstructions(instructions),
  };
}

function parseCrates(crates: string[]) {
  return transpose(
    crates.map((line) =>
      [...line.matchAll(/...( |$)/g)].map((m) =>
        m[0].replaceAll(/[\[\] ]/g, ''),
      ),
    ),
  ).map((col) =>
    col
      .filter((el) => el !== '')
      .slice(0, -1)
      .reverse(),
  );
}

const transpose = <T>(array: ReadonlyArray<ReadonlyArray<T>>) =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));

function parseInstructions(instructions: string[]) {
  const regex = /^move (?<num>\d+) from (?<from>\d+) to (?<to>\d+)$/;

  return instructions
    .filter((i) => i)
    .map((instruction) => {
      const matches = instruction.match(regex)!.groups!;
      return {
        num: Number(matches.num),
        from: Number(matches.from),
        to: Number(matches.to),
      };
    });
}
