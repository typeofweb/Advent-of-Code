import { transpose, trim } from 'ramda';
import { readInput } from './utils';

const BOARD_SIZE = 5;

type TupleOf<T, Len, Acc extends unknown[] = []> = Acc['length'] extends Len ? Acc : TupleOf<T, Len, [...Acc, T]>;
type Row = TupleOf<number, typeof BOARD_SIZE>;
type Board = TupleOf<Row, typeof BOARD_SIZE>;
type WinningBoard = { board: Board; matchingNumbers: number[] };

const parseBoards = (boards: Board[], lines: string[]): Board[] => {
  if (lines.length === 0) {
    return boards;
  }

  const board = lines
    .slice(0, BOARD_SIZE)
    .map((line) => line.split(/\s+/g).filter(trim).map(Number)) as Board;

  return parseBoards([...boards, board], lines.slice(BOARD_SIZE));
};

const readBoards = async () => {
  const [head, ...tail] = await readInput(4);
  const numbers = head.split(',').map(Number);
  const boards = parseBoards(
    [],
    tail.filter((row) => row.trim()),
  );
  return { numbers, boards };
};

const hasWinningRow = (board: Board, numbers: number[]) =>
  board.some((row) => row.every((item) => numbers.some((num) => num === item)));

const isWinning = (numbers: number[]) => (board: Board) => {
  return (
    hasWinningRow(board, numbers) ||
    hasWinningRow(transpose(board) as Board, numbers)
  );
};

const findFirstWinningBoard = (
  boards: Board[],
  numbers: number[],
): WinningBoard | undefined => {
  return numbers.reduce<WinningBoard | undefined>((foundBoard, _, index) => {
    if (foundBoard) {
      return foundBoard;
    }

    const matchingNumbers = numbers.slice(0, index + 1);
    const board = boards.find(isWinning(matchingNumbers));
    if (board) {
      return { board, matchingNumbers };
    }
  }, undefined);
};

const findLastWinningBoard = (
  boards: Board[],
  numbers: number[],
): WinningBoard | undefined => {
  const winningBoard = findFirstWinningBoard(boards, numbers);

  if (boards.length === 1) {
    return winningBoard;
  }
  return findLastWinningBoard(
    boards.filter((b) => b !== winningBoard?.board),
    numbers,
  );
};

const calculateResult = (winningBoard: WinningBoard) => {
  const result = winningBoard.board
    .flat()
    .filter((num) => !winningBoard.matchingNumbers.includes(num))
    .reduce((a, b) => a + b, 0);
  return result * winningBoard.matchingNumbers.at(-1)!;
};

/**
 * @description part 1
 */
(async () => {
  const { numbers, boards } = await readBoards();

  const foundBoard = findFirstWinningBoard(boards, numbers);
  invariant(foundBoard);

  const result = calculateResult(foundBoard);
  console.log(result);
})();

/**
 * @description part 2
 */
(async () => {
  const { numbers, boards } = await readBoards();

  const foundBoard = findLastWinningBoard(boards, numbers);
  invariant(foundBoard);

  const result = calculateResult(foundBoard);
  console.log(result);
})();

function invariant(predicate: unknown): asserts predicate {
  if (predicate == null) throw new Error();
}
