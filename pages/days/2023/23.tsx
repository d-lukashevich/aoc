import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map((row) => [...row]);

type Position = [number, number];
type Path = [Position, Set<string>];

type Tunnel = {
  start: string;
  end: string;
  startPosition: Position | null;
  endPosition: Position | null;
  visited: Set<string>;
};

const getKey = (y: number, x: number) => `${y},${x}`;

const getAround = (y: number, x: number): Position[] => [
  [y, x - 1],
  [y, x + 1],
  [y - 1, x],
  [y + 1, x],
];

const slopes: Record<string, [number, number]> = {
  '<': [0, -1],
  '>': [0, 1],
  '^': [-1, 0],
  v: [1, 0],
};

const allowed = new Set(['.', '<', '>', '^', 'v']);

const getExits = (y: number, x: number, data: string[][]) => {
  const exits: Position[] = [];
  getAround(y, x).forEach(([y, x]) => {
    if (allowed.has(data[y]?.[x])) exits.push([y, x]);
  });
  return exits;
};

const makeTunnels = (visited: Set<string>, data: string[][]): Record<string, Tunnel> => {
  const values = [...visited];
  const start = values[0];
  const end = values.at(-1)!;
  const preStartPosition = start.split(',').map(Number) as Position;
  const preEndPosition = end.split(',').map(Number) as Position;
  const startExits = getExits(...preStartPosition, data);
  const endExits = getExits(...preEndPosition, data);
  const startPosition = startExits.find((position) => !visited.has(getKey(...position))) ?? null;
  const endPosition = endExits.find((position) => !visited.has(getKey(...position))) ?? null;
  return {
    [start]: {
      start,
      end,
      startPosition,
      endPosition,
      visited,
    },
    [end]: {
      start: end,
      end: start,
      startPosition: endPosition,
      endPosition: startPosition,
      visited,
    },
  };
};

const getAllTunnels = (data: string[][]) => {
  const start: Position = [0, 1];

  let tunnels: Record<string, Tunnel> = {};
  const list: [Position, Set<string>][] = [[start, new Set()]];
  const crossroads = new Set<string>();

  while (list.length) {
    const [[y, x], visited] = list.at(-1)!;
    const key = getKey(y, x);
    if (key in tunnels) {
      list.pop();
      continue;
    }

    const exits = getExits(y, x, data);
    // in tunnel
    if (exits.length < 3) {
      visited.add(key);
      const next = exits.find(([_y, _x]) => {
        const _key = getKey(_y, _x);
        return !visited.has(_key) && !crossroads.has(_key);
      });
      if (!next) {
        tunnels = { ...tunnels, ...makeTunnels(visited, data) };
        list.pop();
        continue;
      }
      list.at(-1)![0] = next;
      continue;
    }
    // crossroad
    tunnels = { ...tunnels, ...makeTunnels(visited, data) };
    list.pop();
    crossroads.add(key);
    exits.forEach((position) => {
      list.push([position, new Set()]);
    });
  }

  return tunnels;
};

const first = (raw: string) => {
  const data = getData(raw);
  const start: Position = [0, 1];
  const finish: Position = [data.length - 1, data[0].length - 2];

  const paths: Path[] = [[start, new Set()]];
  let max = 0;

  while (paths.length) {
    const [position, visited] = paths.pop()!;
    const [y, x] = position;
    visited.add(getKey(y, x));
    if (y === finish[0] && x === finish[1]) {
      max = Math.max(max, visited.size - 1);
      continue;
    }

    if (data[y][x] in slopes) {
      const [_y, _x] = slopes[data[y][x]];
      const key = getKey(y + _y, x + _x);
      if (visited.has(key)) continue;
      paths.push([[y + _y, x + _x], visited]);
      continue;
    }

    let firstSend = false;
    getAround(y, x).forEach(([_y, _x]) => {
      if (!allowed.has(data[_y]?.[_x])) return;
      const key = getKey(_y, _x);
      if (visited.has(key)) return;

      if (!firstSend) {
        firstSend = true;
        return paths.push([[_y, _x], visited]);
      }
      paths.push([[_y, _x], new Set(visited)]);
    });
  }

  return max;
};

// brute forced it (well, almost), but ideally it should be done with some kind of graph traversal
const second = (raw: string) => {
  const data = getData(raw);
  const start: Position = [0, 1];

  const paths: Path[] = [[start, new Set(['-1,1'])]];
  let max = 0;

  const tunnels = getAllTunnels(data);
  console.log(tunnels);

  while (paths.length) {
    const [position, visited] = paths.pop()!;
    const [y, x] = position;
    const key = getKey(y, x);
    visited.add(key);

    const tunnel = tunnels[key];
    // in tunnel
    if (tunnel) {
      if (!tunnel.endPosition) {
        const copyVisited = [...visited];
        const allVisited = new Set(copyVisited);
        copyVisited.forEach((key) => {
          const tunnel = tunnels[key];
          if (!tunnel) return;
          tunnel.visited.forEach((key) => allVisited.add(key));
        });

        // -2 to remove zero step and pre zero step (added for tunnels logic simplification)
        if (allVisited.size - 2 > max) {
          console.log('new max', allVisited.size - 2);
        }
        max = Math.max(max, allVisited.size - 2);
      } else {
        if (visited.has(getKey(...tunnel.endPosition))) continue;
        visited.add(tunnel.end);
        paths.push([tunnel.endPosition, visited]);
      }
      continue;
    }

    // in crossroad

    const candidates: Position[] = getAround(y, x).filter(([_y, _x]) => {
      if (!allowed.has(data[_y]?.[_x])) return false;
      const _key = getKey(_y, _x);
      return !visited.has(_key);
    });

    let firstSend = false;
    candidates.forEach((candidate) => {
      const [_y, _x] = candidate;
      if (!firstSend) {
        firstSend = true;
        return paths.push([[_y, _x], visited]);
      }
      paths.push([[_y, _x], new Set(visited)]);
    });
  }

  return max;
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
