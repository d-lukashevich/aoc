import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

// Too tired to make it properly

type RobotCost = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};

type Blueprint = [RobotCost, RobotCost, RobotCost, RobotCost];

type Counter = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};

const initRobot = (ore: number | string, clay: number | string, obsidian: number | string) => {
  return {
    ore: Number(ore),
    clay: Number(clay),
    obsidian: Number(obsidian),
    geode: 0,
  };
};

const initCount = (ore: number | string, clay: number | string, obsidian: number | string, geode: string | number) => {
  return {
    ore: Number(ore),
    clay: Number(clay),
    obsidian: Number(obsidian),
    geode: Number(geode),
  } as Counter;
};

const reg =
  /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
const getData = (raw: string): Blueprint[] => {
  const text = raw.replaceAll('\n', '","');
  const preData: string[] = JSON.parse(`["${text}"]`);
  return preData.map((str) => {
    const res = str.match(reg) as string[];
    return [
      initRobot(res[1], 0, 0),
      initRobot(res[2], 0, 0),
      initRobot(res[3], res[4], 0),
      initRobot(res[5], 0, res[6]),
    ];
  });
};

const numKeys: Record<0 | 1 | 2 | 3, keyof Counter> = {
  0: 'ore',
  1: 'clay',
  2: 'obsidian',
  3: 'geode',
};

const getCaps = (blueprint: Blueprint): [Counter, number[]] => {
  const caps = blueprint.reduce((acc, costs) => {
    acc.ore = Math.max(acc.ore, costs.ore);
    acc.clay = Math.max(acc.clay, costs.clay);
    acc.obsidian = Math.max(acc.obsidian, costs.obsidian);
    return acc;
  }, initCount(0, 0, 0, Infinity));
  const capsArray = [
    Math.max(...blueprint.map((costs) => costs.ore)),
    Math.max(...blueprint.map((costs) => costs.clay)),
    Math.max(...blueprint.map((costs) => costs.obsidian)),
    Infinity,
  ];
  return [caps, capsArray];
};

const emptyLocks = [false, false, false];
const getBest = (blueprint: Blueprint, timeLimit = 24): number => {
  const seen: Record<string, number> = {};
  const [caps, capsArray] = getCaps(blueprint);

  const start = { time: 0, store: initCount(0, 0, 0, 0), power: initCount(1, 0, 0, 0) };
  const queue: { time: number; store: Counter; power: Counter; locks?: boolean[] }[] = [start];
  let max = 0;

  while (queue.length) {
    const item = queue.pop();
    if (!item) throw new Error('should be');

    let { time, store, power, locks = emptyLocks } = item;
    Object.entries(caps).forEach(([key, value]) => {
      if (store[key as keyof Counter] > value && power[key as keyof Counter] === value) {
        store[key as keyof Counter] = value;
      } else if (store[key as keyof Counter] > value + power[key as keyof Counter] * 2) {
        store[key as keyof Counter] = value;
      }
    });

    const key = `${time};${Object.values(store).join(',')};${Object.values(power).join(',')}`;
    if (key in seen) {
      continue;
    } else {
      seen[key] = store.geode;
    }

    if (time === timeLimit) {
      max = Math.max(max, store.geode);
      continue;
    }
    const alts = blueprint.map((costs, i) => {
      if (capsArray[i] === power[numKeys[i as 0 | 1 | 2 | 3]]) return false;
      return Object.entries(costs).every(([key, cost]) => cost <= store[key as keyof Counter]) ? costs : null;
    });

    time++;
    store = {
      ore: store.ore + power.ore,
      clay: store.clay + power.clay,
      obsidian: store.obsidian + power.obsidian,
      geode: store.geode + power.geode,
    };

    if (alts.some(Boolean)) {
      alts.forEach((costs, i) => {
        if (!costs || locks[i] || capsArray[i] === power[numKeys[i as 0 | 1 | 2 | 3]]) return null;
        const storeNew: Counter = {
          ore: store.ore - costs.ore,
          clay: store.clay - costs.clay,
          obsidian: store.obsidian - costs.obsidian,
          geode: store.geode,
        };
        const powerNew: Counter = {
          ore: power.ore + Number(i === 0),
          clay: power.clay + Number(i === 1),
          obsidian: power.obsidian + Number(i === 2),
          geode: power.geode + Number(i === 3),
        };
        queue.push({ time, store: storeNew, power: powerNew });
      });
    }
    if (alts.includes(null)) {
      const newLock = alts.map(Boolean);
      queue.push({ time, store, power, locks: newLock });
    }
  }

  return max;
};

const solveFirst = (raw: string) => {
  const data = getData(raw);

  const results = data.map((blueprint, i) => {
    const result = getBest(blueprint);
    console.log(`done: ${i}/${data.length}`);
    return result;
  });
  console.log('Final', results);
  return results.reduce((acc, value, i) => {
    return acc + value * (i + 1);
  }, 0);
};

const solveSecond = (raw: string) => {
  const data = getData(raw);

  const results = data.slice(0, 3).map((blueprint, i, arr) => {
    const result = getBest(blueprint, 32);
    console.log(`done: ${i}/${arr.length}`);
    return result;
  });
  console.log('Final', results);
  return results.reduce((acc, value) => acc * value);
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={19} func={solveFirst} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
