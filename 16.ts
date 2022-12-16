import { readInput } from './utils';

type ValveId = string & { _: 'ValveId' };
type FlowRate = number;
type State = {
  valveToFlowRate: Record<ValveId, FlowRate>;
  allValves: Array<ValveId>;
  valvesWithPositiveFlowRate: Array<ValveId>;
  shortestPaths: Record<`${ValveId}->${ValveId}`, number>;
};
type Data = {
  currentValve: ValveId;
  openValves: string;
  timeLeft: number;
  totalFlow: number;
};
// conceptually the type should be this but it doesn't work:
// type OpenValves = `${ValveId}` | `${ValveId}|${OpenValves}`

type VisitedKey =
  `${Data['currentValve']}|${Data['openValves']}|${Data['timeLeft']}|${Data['totalFlow']}`;

/**
 * @description part 1
 */
(async () => {
  const data = await readInput(16);

  const state = parseData(data);
  // console.log(state);

  console.log(solve(30, state).maxFlow);
})();

/**
 * @description part 2
 */
(async () => {
  const data = await readInput(16);

  const state = parseData(data);
  // console.log(state);

  const solution = solve(26, state);

  // Elephant and I do the same thing
  // now we just need to find two paths in the graph
  // that don't overlap and have the greatest total flow
  let maxTotal = 0;
  for (const k1 in solution.maxFlowForOpenValves) {
    for (const k2 in solution.maxFlowForOpenValves) {
      const s1 = k1.slice(1).split('|');
      const s2 = k2.slice(1).split('|');
      // skip if my and elephant's paths have overlap
      const haveOverlap = s1.some((v) => s2.includes(v));
      if (haveOverlap) {
        continue;
      }

      const v1 = solution.maxFlowForOpenValves[k1];
      const v2 = solution.maxFlowForOpenValves[k2];
      if (maxTotal < v1 + v2) {
        maxTotal = v1 + v2;
      }
    }
  }
  console.log({ maxTotal });
})();

function solve(minutes: number, state: State) {
  // traverse a graph that is a combination of each vertice, time, open valves and flow
  // i.e. vertex BB at time t=30 is different from vertex BB at time t=29…
  // also vertex BB at time t=15 is different from vertex BB at time t=15 if flows are different
  // it means different paths were taken in the graph
  const queue: Array<Data> = [
    {
      currentValve: 'AA' as ValveId,
      openValves: '',
      timeLeft: minutes,
      totalFlow: 0,
    },
  ];

  const visited = new Set<VisitedKey>();

  let maxFlow = 0;
  const maxFlowForOpenValves: Record<Data['openValves'], number> = {};
  while (true) {
    const data = queue.pop();
    if (!data) {
      break;
    }

    if (data.timeLeft <= 0) {
      continue;
    }

    const visitedKey: VisitedKey = `${data['currentValve']}|${data['openValves']}|${data['timeLeft']}|${data['totalFlow']}`;
    if (visited.has(visitedKey)) {
      continue;
    }
    visited.add(visitedKey);

    if (data.totalFlow > maxFlow) {
      maxFlow = data.totalFlow;
    }
    maxFlowForOpenValves[data.openValves] = Math.max(
      maxFlowForOpenValves[data.openValves] ?? 0,
      data.totalFlow ?? 0,
    );

    // check path to each vertex that has flow
    // (doesn't make sense to check vertices with flow=0)
    state.valvesWithPositiveFlowRate.forEach((v) => {
      // can't open the same valve twice
      if (data.openValves.includes(v)) {
        return;
      }

      // time it takes to travel and open the valve
      const travelTime = state.shortestPaths[`${data.currentValve}->${v}`] + 1;
      const newTimeLeft = data.timeLeft - travelTime;
      if (newTimeLeft <= 0) {
        return;
      }

      queue.push({
        currentValve: v,
        openValves: withNewOpenValves(data.openValves, v),
        timeLeft: newTimeLeft,
        totalFlow: data.totalFlow + newTimeLeft * state.valveToFlowRate[v],
      });
    });
  }

  return { maxFlow, maxFlowForOpenValves };
}

function parseData(data: string[]) {
  const regex =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/;

  const state = data
    .map((line) => {
      const [_, fromValve, flowRateStr, toValvesStr] = line.match(regex)!;
      const flowRate = Number(flowRateStr);
      const toValves = toValvesStr.split(', ');

      return {
        fromValve: fromValve as ValveId,
        toValves: toValves as ValveId[],
        flowRate,
      };
    })
    .reduce<State>(
      (acc, el) => {
        acc.valveToFlowRate[el.fromValve] = el.flowRate;
        acc.allValves.push(el.fromValve);
        if (el.flowRate > 0) {
          acc.valvesWithPositiveFlowRate.push(el.fromValve);
        }

        acc.shortestPaths[`${el.fromValve}->${el.fromValve}`] = 0;
        el.toValves.forEach((toValve) => {
          acc.shortestPaths[`${el.fromValve}->${toValve}`] = 1;
        });
        return acc;
      },
      {
        valveToFlowRate: {},
        allValves: [],
        valvesWithPositiveFlowRate: [],
        shortestPaths: {},
      },
    );

  // https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
  // for k from 1 to |V|
  //   for i from 1 to |V|
  //     for j from 1 to |V|
  //       if dist[i][j] > dist[i][k] + dist[k][j]
  //         dist[i][j] ← dist[i][k] + dist[k][j]
  for (const k of state.allValves) {
    for (const i of state.allValves) {
      for (const j of state.allValves) {
        state.shortestPaths[`${i}->${j}`] ??= Infinity;
        state.shortestPaths[`${i}->${k}`] ??= Infinity;
        state.shortestPaths[`${k}->${j}`] ??= Infinity;

        const sum =
          state.shortestPaths[`${i}->${k}`] + state.shortestPaths[`${k}->${j}`];

        if (state.shortestPaths[`${i}->${j}`] > sum) {
          state.shortestPaths[`${i}->${j}`] = sum;
        }
      }
    }
  }
  return state;
}

function withNewOpenValves(openValves: string, valveId: ValveId) {
  return openValves.split('|').concat(valveId).sort().join('|');
}
