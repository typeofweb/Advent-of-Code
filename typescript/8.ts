import { DFlip, readInput } from './utils';
import { A, N, O, S, D, F, R, B, G, pipe } from '@mobily/ts-belt';

const stringComparator = (a: string, b: string) => a.localeCompare(b);

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type KnownDigits = Partial<Record<Digit, string>>;
type Rule = (knownDigits: KnownDigits) => (inputDigit: string) => boolean;

const rules: Record<Digit, Rule> = {
  1: (knownDigits) => (inputDigit) => inputDigit.length === 2,
  7: (knownDigits) => (inputDigit) => inputDigit.length === 3,
  4: (knownDigits) => (inputDigit) => inputDigit.length === 4,
  8: (knownDigits) => (inputDigit) => inputDigit.length === 7,
  3: (knownDigits) => (inputDigit) => {
    return (
      inputDigit.length === 5 &&
      isIncludedIn(knownDigits?.[1], inputDigit) &&
      isIncludedIn(knownDigits?.[7], inputDigit)
    );
  },
  9: (knownDigits) => (inputDigit) => {
    //6 chars and includes 1, 3, 7, 4, 5
    return (
      inputDigit.length === 6 &&
      isIncludedIn(knownDigits?.[1], inputDigit) &&
      isIncludedIn(knownDigits?.[3], inputDigit) &&
      isIncludedIn(knownDigits?.[7], inputDigit) &&
      isIncludedIn(knownDigits?.[4], inputDigit)
    );
  },
  0: (knownDigits) => (inputDigit) => {
    //6 chars and includes 1, 7
    return (
      inputDigit.length === 6 &&
      isIncludedIn(knownDigits?.[1], inputDigit) &&
      isIncludedIn(knownDigits?.[7], inputDigit)
    );
  },
  6: (knownDigits) => (inputDigit) => {
    //6 chars and includes 5
    return (
      inputDigit.length === 6 && isIncludedIn(knownDigits?.[5], inputDigit)
    );
  },
  5: (knownDigits) => (inputDigit) => {
    //5 chars and is included in 8, 9
    return (
      inputDigit.length === 5 &&
      isIncludedIn(inputDigit, knownDigits?.[8]) &&
      isIncludedIn(inputDigit, knownDigits?.[9])
    );
  },
  2: (knownDigits) => (inputDigit) => {
    //5 chars and is included in 841
    return (
      inputDigit.length === 5 && isIncludedIn(inputDigit, knownDigits?.[8])
    );
  },
};

const order = [1, 7, 4, 8, 3, 9, 0, 5, 6, 2] as const;

/**
 * @description part 1 & 2
 */
(async () => {
  const data = await readInput(8);

  const solve = (line: string) => {
    const [input, numberToDecode] = pipe(
      line,
      S.split(' | '),
      A.map(S.splitByRe(/\s+/g)),
      A.map(
        A.map((x) =>
          pipe(x, O.getExn, S.split(''), A.sort(stringComparator), A.join('')),
        ),
      ),
    );

    const inputToDigit = pipe(input, matchNumbersAgainstInput, DFlip);

    const result = pipe(
      numberToDecode,
      A.map((x) => D.prop(inputToDigit, x)),
      A.join(''),
      Number,
    );

    return result;
  };

  console.log(pipe(data, A.map(solve), A.reduce(0 as number, N.add)));
})().catch(console.error);

function matchNumbersAgainstInput(
  inputDigits: readonly string[],
  knownDigits: KnownDigits = {},
  index: number = 0,
): KnownDigits {
  if (index === order.length) {
    return knownDigits;
  }

  const currentDigitLookingFor: Digit = order[index];
  const [matchedDigitIndex, matchedDigit] = pipe(
    inputDigits,
    A.getIndexBy(rules[currentDigitLookingFor](knownDigits)),
    O.map((index) => [index, inputDigits[index]] as const),
    O.getExn,
  );

  return matchNumbersAgainstInput(
    A.removeAt(inputDigits, matchedDigitIndex),
    { ...knownDigits, [currentDigitLookingFor]: matchedDigit },
    index + 1,
  );
}

const isIncludedIn = (
  needle: string | undefined,
  haystack: string | undefined,
): boolean => {
  if (!needle || !haystack) {
    return false;
  }
  const ns: readonly string[] = needle.split('');
  const hs: readonly string[] = haystack.split('');

  return A.every(ns, (n) => A.includes(hs, n));
};
