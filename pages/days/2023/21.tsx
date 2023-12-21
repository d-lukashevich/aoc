import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map((row) => [...row]);

const getKey = (y: number, x: number) => `${y},${x}`;

const first = (raw: string) => {
  const data = getData(raw);

  const marked = new Set<string>();

  const originY = data.findIndex((row) => row.includes('S'));
  const originX = data[originY].findIndex((cell) => cell === 'S');
  data[originY][originX] = '.';

  const maxLen = 128;

  const cache = new Set<string>();
  const stack: [string, number][] = [[getKey(originY, originX), maxLen]];

  const count = (): void => {
    const [key, stepsLast] = stack.pop()!;
    const cacheKey = `${key}|${stepsLast}`;
    if (cache.has(cacheKey)) return;
    cache.add(cacheKey);
    const [y, x] = key.split(',').map(Number) as [number, number];
    if (stepsLast === 0) {
      marked.add(key);
      return;
    }

    if (data[y]?.[x + 1] === '.') stack.push([getKey(y, x + 1), stepsLast - 1]);
    if (data[y]?.[x - 1] === '.') stack.push([getKey(y, x - 1), stepsLast - 1]);
    if (data[y + 1]?.[x] === '.') stack.push([getKey(y + 1, x), stepsLast - 1]);
    if (data[y - 1]?.[x] === '.') stack.push([getKey(y - 1, x), stepsLast - 1]);
  };

  while (stack.length) {
    count();
  }

  return [...marked].length;
};

const second = (raw: string) => {
  const data = getData(raw);

  const originY = data.findIndex((row) => row.includes('S'));
  const originX = data[originY].findIndex((cell) => cell === 'S');
  data[originY][originX] = '.';

  const yLen = data.length;
  const xLen = data[0].length;

  const cycle = (maxLen: number) => {
    const cache = new Set<string>();
    const marked = new Set<string>();
    const stack: [string, number][] = [[getKey(originY, originX), maxLen]];

    const count = (): void => {
      const [key, stepsLast] = stack.pop()!;
      const cacheKey = `${key}|${stepsLast}`;
      if (cache.has(cacheKey)) return;
      cache.add(cacheKey);
      const [y, x] = key.split(',').map(Number) as [number, number];
      if (stepsLast === 0) {
        marked.add(key);
        return;
      }

      const _y = ((y % yLen) + yLen) % yLen;
      const _x = ((x % yLen) + xLen) % xLen;

      if (data[_y][(_x + 1 + xLen) % xLen] === '.') stack.push([getKey(y, x + 1), stepsLast - 1]);
      if (data[_y][(((_x - 1 + xLen) % xLen) + xLen) % xLen] === '.') stack.push([getKey(y, x - 1), stepsLast - 1]);
      if (data[(_y + 1 + yLen) % yLen][_x] === '.') stack.push([getKey(y + 1, x), stepsLast - 1]);
      if (data[(_y - 1 + yLen) % yLen][_x] === '.') stack.push([getKey(y - 1, x), stepsLast - 1]);
    };

    while (stack.length) count();
    return [...marked].length;
  };

  const getPoints = (values: number[]) => {
    return [values[0] / 2 - values[1] + values[2] / 2, -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2, values[0]];
  };
  const values = [cycle(65), cycle(65 + 131), cycle(65 + 131 * 2)];
  const target = (26501365 - 65) / 131;
  const points = getPoints(values);
  return points[0] * target * target + points[1] * target + points[2];
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
