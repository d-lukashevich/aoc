import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Node = {
  name: string;
  rate: number;
  tunnelsList: string[];
};

type MapNode = {
  name: string;
  rate: number;
  times: Record<string, number>;
};

const reg = /Valve (..) has flow rate=(\d+); tunnels* leads* to valves* (.+)/;
const getData = (raw: string) => {
  const text = raw.replaceAll('\n', '", "');
  const preData: string[][] = JSON.parse(`["${text}"]`).map((str: string) => str.match(reg));
  return preData.reduce((acc: Record<string, Node>, [, name, rateStr, destinationsRaw]) => {
    acc[name] = {
      name,
      rate: Number(rateStr),
      tunnelsList: destinationsRaw.split(', '),
    };
    return acc;
  }, {});
};

const getMap = (raw: string) => {
  const data = getData(raw);
  const map: Record<string, MapNode> = {};
  Object.values(data).forEach((node) => {
    if (node.rate || node.name === 'AA') {
      const mapNode: MapNode = {
        name: node.name,
        rate: node.rate,
        times: {},
      };
      const visited = new Set();
      const queue: [string, number][] = node.tunnelsList.map((str) => [str, 1]);
      while (queue.length) {
        const [name, hops] = queue.shift() as [string, number];
        visited.add(name);
        const node = data[name];
        if (node.rate && node.name !== mapNode.name) mapNode.times[name] = hops;
        node.tunnelsList.forEach((str) => {
          if (!visited.has(str)) queue.push([str, hops + 1]);
        });
      }
      map[node.name] = mapNode;
    }
  });
  return map;
};

const solveFirst = (raw: string) => {
  const map = getMap(raw);
  const limit = 30;
  let max = 0;

  const check = (spot: string, time: number, pressure: number, total: number, openHash: Record<string, boolean>) => {
    const newTime = time + 1;
    const timeLeft = limit - newTime;

    const targets = Object.entries(map[spot].times).filter(([target, targetTime]) => {
      return targetTime + 1 < timeLeft && !openHash[target];
    });

    const newPressure = pressure + map[spot].rate;
    const newTotal = total + pressure;
    const newHash = { ...openHash, [spot]: true };

    if (!targets.length) {
      const result = total + pressure + newPressure * timeLeft;
      if (result > max) max = result;
      return;
    }

    targets.forEach(([target, targetTime]) => {
      check(target, newTime + targetTime, newPressure, newPressure * targetTime + newTotal, newHash);
    });
  };

  Object.entries(map.AA.times).forEach(([spot, time]) => {
    check(spot, time, 0, 0, { AA: true });
  });
  return max;
};

type Route = [string, number];

const solveSecond = (raw: string) => {
  const map = getMap(raw);
  const limit = 26;
  let max = 0;

  const getRoutes = (a: Route, b: Route, timeLeft: number, openHash: Record<string, boolean> = {}) => {
    const isSame = a[0] === b[0];
    const aList =
      a[1] >= 0
        ? [a]
        : Object.entries(map[a[0]].times).filter(([target, targetTime]) => {
            return targetTime + 1 < timeLeft && !openHash[target] && target !== b[0];
          });
    if (!aList.length) aList.push(['AA', Infinity]);
    const bList =
      b[1] >= 0
        ? [b]
        : Object.entries(map[b[0]].times).filter(([target, targetTime]) => {
            return targetTime + 1 < timeLeft && !openHash[target] && target !== a[0];
          });
    if (!bList.length) bList.push(['AA', Infinity]);
    const result: [Route, Route][] = [];
    const visited: Record<string, boolean> = {};

    aList.forEach((aItem) => {
      if (isSame) visited[aItem[0]] = true;
      bList.forEach((bItem) => {
        if ((aItem[0] !== bItem[0] || aItem[0] === 'AA') && !visited[bItem[0]]) {
          result.push([aItem, bItem]);
        }
      });
    });

    return result;
  };

  const check = (
    [aStartRoute, bStartRoute]: [Route, Route],
    time: number,
    pressure: number,
    total: number,
    openHash: Record<string, boolean>
  ) => {
    const shift = Math.min(aStartRoute[1], bStartRoute[1], limit - time);
    time += shift;
    total += pressure * shift;

    if (time === limit) {
      if (total > max) max = total;
      return;
    }
    time++;
    total += pressure;

    const aRoute: Route = [aStartRoute[0], aStartRoute[1] - shift - 1];
    const bRoute: Route = [bStartRoute[0], bStartRoute[1] - shift - 1];

    if (aRoute[1] < 0) {
      pressure += map[aRoute[0]].rate;
      openHash = { ...openHash, [aRoute[0]]: true };
    }
    if (bRoute[1] < 0) {
      pressure += map[bRoute[0]].rate;
      openHash = { ...openHash, [bRoute[0]]: true };
    }

    const routesList = getRoutes(aRoute, bRoute, limit - time, openHash);
    routesList.forEach((routes) => {
      check(routes, time, pressure, total, openHash);
    });
  };

  const routesList: [Route, Route][] = getRoutes(['AA', -1], ['AA', -1], limit);
  routesList.forEach((routes) => {
    check(routes, 0, 0, 0, { AA: true });
  });
  return max;
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={16} func={solveFirst} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
