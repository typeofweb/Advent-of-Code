import { A, pipe } from '@mobily/ts-belt';

(() => {
  type Data = { x: number; y: number; vx: number; vy: number };

  const x0 = 287;
  const x1 = 309;
  const y0 = -48;
  const y1 = -76;
  // const x0 = 20;
  // const x1 = 30;
  // const y0 = -5;
  // const y1 = -10;

  const step = (start: Data, state = start, acc: Data[] = []): Data[] => {
    const newState = {
      x: state.x + state.vx,
      y: state.y + state.vy,
      vx: Math.max(0, state.vx - 1),
      vy: state.vy - 1,
    };

    if (state.x >= x0 && state.x <= x1 && state.y <= y0 && state.y >= y1) {
      return step(start, newState, [...acc, start]);
    }
    if (state.x > x1 || state.y < y1) {
      return acc;
    }
    return step(start, newState, acc);
  };

  pipe(
    A.makeWithIndex(1000, (vx) =>
      A.makeWithIndex(2000, (vy) => [vx, vy - 1000]),
    ),
    A.flat,
    A.map(([vx, vy]) => step({ x: 0, y: 0, vx, vy })),
    A.flat,
    A.map((st) => `${st.vx},${st.vy}`),
    A.uniq,
    A.length,
    console.log,
  );
})();
