import * as Fs from 'node:fs/promises';

export const readInput = async (num: number) => {
  const input = await Fs.readFile(`input${num}`, 'utf-8');
  return input.split('\n');
};
