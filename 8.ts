import { readInput } from './utils';

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(8);
  const grid = data.map((line) => line.split('').map(Number));
  const h = grid.length;
  const w = grid[0].length;

  let counter = 0;
  for (let y = 1; y < h - 1; ++y) {
    for (let x = 1; x < w - 1; ++x) {
      const value = grid[y][x];

      const top = (() => {
        for (let y2 = 0; y2 < y; ++y2) {
          const testedValue = grid[y2][x];
          if (testedValue >= value) {
            return false;
          }
        }
        return true;
      })();
      const right = (() => {
        for (let x2 = w - 1; x2 > x; --x2) {
          const testedValue = grid[y][x2];
          if (testedValue >= value) {
            return false;
          }
        }
        return true;
      })();
      const bottom = (() => {
        for (let y2 = h - 1; y2 > y; --y2) {
          const testedValue = grid[y2][x];
          if (testedValue >= value) {
            return false;
          }
        }
        return true;
      })();
      const left = (() => {
        for (let x2 = 0; x2 < x; ++x2) {
          const testedValue = grid[y][x2];
          if (testedValue >= value) {
            return false;
          }
        }
        return true;
      })();
      if (top || right || bottom || left) {
        ++counter;
      }
    }
  }

  console.log(counter + 2 * w + 2 * h - 4);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(8);
  const grid = data.map((line) => line.split('').map(Number));
  const h = grid.length;
  const w = grid[0].length;

  let max = 0;

  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      const value = grid[y][x];

      const top = (() => {
        let counter = 0;
        for (let y2 = y - 1; y2 >= 0; --y2) {
          ++counter;
          const testedValue = grid[y2][x];
          if (testedValue >= value) {
            break;
          }
        }
        return counter;
      })();
      const right = (() => {
        let counter = 0;
        for (let x2 = x + 1; x2 < w; ++x2) {
          ++counter;
          const testedValue = grid[y][x2];
          if (testedValue >= value) {
            break;
          }
        }
        return counter;
      })();
      const bottom = (() => {
        let counter = 0;
        for (let y2 = y + 1; y2 < h; ++y2) {
          ++counter;
          const testedValue = grid[y2][x];
          if (testedValue >= value) {
            break;
          }
        }
        return counter;
      })();
      const left = (() => {
        let counter = 0;
        for (let x2 = x - 1; x2 >= 0; --x2) {
          ++counter;
          const testedValue = grid[y][x2];
          if (testedValue >= value) {
            break;
          }
        }
        return counter;
      })();
      const total = top * right * bottom * left;
      max = Math.max(total, max);
    }
  }

  console.log(max);
})();
