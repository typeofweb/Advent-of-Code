import { readInput } from './utils';

const a = 'a'.codePointAt(0)!;
const A = 'A'.codePointAt(0)!;
const letterToPriority = (letter: string) => {
  const codePoint = letter.codePointAt(0)!;
  const modifier = codePoint < 97 ? A - 27 : a - 1;
  return codePoint - modifier;
};

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(3);
  const x = data
    .map((line) => {
      const [half1, half2] = [
        line.slice(0, line.length / 2).split(''),
        line.slice(line.length / 2),
      ];
      const common = [
        ...new Set(half1.filter((letter) => half2.includes(letter))),
      ];
      if (common.length === 0) {
        return 0;
      } else if (common.length === 1) {
        return letterToPriority(common[0]);
      } else {
        throw new Error(`I didn't expect that.`);
      }
    })
    .reduce((acc, el) => acc + el);
  console.log(x);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(3);
  const x = data
    .reduce<string[][]>((array, line, idx) => {
      if (idx % 3 === 0) {
        array.push([]);
      }
      array.at(-1)?.push(line);
      return array;
    }, [])
    .map((group) => group.map((el) => new Set(el.split(''))))
    .map((group) => {
      const [first, second, third] = group;
      return letterToPriority(
        [...first].find((el) => second.has(el) && third.has(el))!,
      );
    })
    .reduce((acc, el) => acc + el, 0);
  console.log(x);
})();
