import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Rocks = [number, number][][];

type Map = boolean[][];

const getData = (raw: string): Rocks => {
  const text = '"' + raw.replaceAll('\n', '","') + '"';
  return JSON.parse(`[${text}]`).map((str: string) => {
    const strCoords = str.split(' -> ');
    return strCoords.map((strCoord: string) => strCoord.split(',').map(Number));
  });
};

const getMap = (rocks: Rocks) => {
  const map: Map = [];
  rocks.forEach((track) => {
    track.forEach((coordinateA, index) => {
      const coordinateB = track[index + 1];
      if (!coordinateB) return;
      [0, 1].forEach((i) => {
        const min = Math.min(coordinateA[i], coordinateB[i]);
        const max = Math.max(coordinateA[i], coordinateB[i]);
        let diff = max - min;
        while (diff > -1) {
          const x = i === 0 ? min + diff : coordinateA[0];
          const y = i === 1 ? min + diff : coordinateA[1];
          map[y] ??= [];
          map[y][x] = true;
          diff--;
        }
      });
    });
  });
  return map;
};

const solveFirst = (raw: string) => {
  const data = getData(raw);
  const map = getMap(data);
  const run = (x: number, y: number): [number, number] | null => {
    if (y > map.length) return null;
    if (!map[y + 1]?.[x]) return run(x, y + 1);
    if (!map[y + 1]?.[x - 1]) return run(x - 1, y + 1);
    if (!map[y + 1]?.[x + 1]) return run(x + 1, y + 1);
    return [x, y];
  };

  let count = 0;
  while (Infinity) {
    const runResult = run(500, 0);
    if (!runResult) break;
    count++;
    const [x, y] = runResult;
    map[y] ??= [];
    map[y][x] = true;
  }

  return count;
};

const solveSecond = (raw: string) => {
  const data = getData(raw);
  const map = getMap(data);
  const limit = map.length;
  const run = (x: number, y: number): [number, number] | null => {
    if (y === limit) return [x, y];
    if (!map[y + 1]?.[x]) return run(x, y + 1);
    if (!map[y + 1]?.[x - 1]) return run(x - 1, y + 1);
    if (!map[y + 1]?.[x + 1]) return run(x + 1, y + 1);
    if (y === 0) return null;
    return [x, y];
  };

  let count = 0;
  while (Infinity) {
    const runResult = run(500, 0);
    count++;
    if (!runResult) break;
    const [x, y] = runResult;
    map[y] ??= [];
    map[y][x] = true;
  }

  return count;
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={14} func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
