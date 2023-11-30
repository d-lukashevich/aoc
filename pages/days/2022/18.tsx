import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Entry = [number, number, number];
type Map = boolean[][][];

const getData = (raw: string): Entry[] => {
  const text = raw.replaceAll('\n', '],[');
  return JSON.parse(`[[${text}]]`);
};

const getMap = (data: Entry[]): Map => {
  const map: boolean[][][] = [];
  data.forEach(([x, y, z]) => {
    map[x] ??= [];
    map[x][y] ??= [];
    map[x][y][z] = true;
  });
  return map;
};

const calcFreeSides = ([x, y, z]: Entry, map: Map) => {
  let counter = 6;
  if (map[x - 1]?.[y]?.[z]) counter--;
  if (map[x + 1]?.[y]?.[z]) counter--;
  if (map[x]?.[y - 1]?.[z]) counter--;
  if (map[x]?.[y + 1]?.[z]) counter--;
  if (map[x]?.[y]?.[z - 1]) counter--;
  if (map[x]?.[y]?.[z + 1]) counter--;
  return counter;
};

const getMax = (entries: Entry[]) => {
  return entries.reduce(
    (acc, [x, y, z]) => {
      acc[0] = Math.max(acc[0], x);
      acc[1] = Math.max(acc[1], y);
      acc[2] = Math.max(acc[2], z);
      return acc;
    },
    [0, 0, 0]
  );
};

const solveFirst = (raw: string) => {
  const data = getData(raw);
  const map = getMap(data);
  return data.reduce((acc, entry) => acc + calcFreeSides(entry, map), 0);
};

const solveSecond = (raw: string) => {
  const data = getData(raw);
  const map = getMap(data);
  const external = data.reduce((acc, entry) => acc + calcFreeSides(entry, map), 0);

  const max = getMax(data);

  let queue: Entry[] = [];
  let candidates: Entry[] = [];
  let airConnected = false;
  const visited = new Set<string>();
  const trapped: Entry[] = [];

  const checkCavern = () => {
    const entry = queue.shift();
    if (!entry) return;
    const key = entry.join(',');
    if (!visited.has(key)) {
      candidates.push(entry);
      visited.add(key);
      const forCheck: Entry[] = [];
      const checkAdjacent = ([x, y, z]: Entry) => {
        const isAirConnected = x < 0 || y < 0 || z < 0 || x > max[0] || y > max[1] || z > max[2];
        if (isAirConnected) {
          airConnected = true;
        } else {
          if (!map[x]?.[y]?.[z]) forCheck.push([x, y, z]);
        }
      };
      checkAdjacent([entry[0] - 1, entry[1], entry[2]]);
      checkAdjacent([entry[0] + 1, entry[1], entry[2]]);
      checkAdjacent([entry[0], entry[1] - 1, entry[2]]);
      checkAdjacent([entry[0], entry[1] + 1, entry[2]]);
      checkAdjacent([entry[0], entry[1], entry[2] - 1]);
      checkAdjacent([entry[0], entry[1], entry[2] + 1]);
      queue.push(...forCheck);
    }
  };

  for (let i = 0; i <= max[0]; i++) {
    for (let j = 0; j <= max[1]; j++) {
      for (let k = 0; k <= max[2]; k++) {
        const cube = map[i]?.[j]?.[k];
        const entry = [i, j, k];
        if (!cube && !visited.has(entry.join(','))) {
          queue.push([i, j, k]);
          while (queue.length) {
            checkCavern();
          }
          if (!airConnected) trapped.push(...candidates);
          candidates = [];
          airConnected = false;
        }
      }
    }
  }

  const cavernSides = trapped.reduce((acc, entry) => acc + 6 - calcFreeSides(entry, map), 0);
  return external - cavernSides;
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
