import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const reg = /(.+)-> (.+)/;

const getCoords = (str: string) => {
  const [x, y] = str
    .split(',')
    .map((str) => str.trim())
    .map(Number);
  return [x, y] as const;
};

type Coords = readonly [number, number];
type CoordsShift = readonly [Coords, Coords];

const getData = (raw: string): CoordsShift[] => {
  return parseRows(raw).map((row) => {
    const [, prev, next] = row.match(reg)!;
    return [getCoords(prev), getCoords(next)];
  });
};

const countOverlaps = (data: CoordsShift[]) => {
  const counters: number[][] = [];
  data.forEach(([[...prev], [...next]]) => {
    while (true) {
      counters[prev[0]] ??= [];
      counters[prev[0]][prev[1]] ??= 0;
      counters[prev[0]][prev[1]]++;

      if (prev[0] == next[0] && prev[1] == next[1]) break;
      if (prev[0] < next[0]) prev[0]++;
      if (prev[0] > next[0]) prev[0]--;
      if (prev[1] < next[1]) prev[1]++;
      if (prev[1] > next[1]) prev[1]--;
    }
  });
  return counters.reduce((acc, row) => {
    return acc + row.reduce((acc, num) => acc + (num > 1 ? 1 : 0), 0);
  }, 0);
};

const first = (raw: string) => {
  const straights = getData(raw).filter(([prev, next]) => {
    return prev[0] === next[0] || prev[1] === next[1];
  });
  return countOverlaps(straights);
};

const second = (raw: string) => countOverlaps(getData(raw));

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
