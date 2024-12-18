import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Pos = [number, number];

const getData = (raw: string) => parseRows(raw).map((row) => row.split(',').map(Number) as Pos);

const getAround = ([x, y]: Pos) => [
  [x + 1, y],
  [x, y + 1],
  [x - 1, y],
  [x, y - 1],
];

const runSearch = (data: Pos[], startIdx: number) => {
  const lim = 70;
  const start: Pos = [0, 0];
  const finish: Pos = [lim, lim];
  const corrupted = new Set<string>();

  for (let i = 0; i < startIdx; i++) {
    corrupted.add(data[i].join(','));
  }

  const queue = [{ pos: start, steps: 0 }];
  let best = Infinity;
  const seen = new Map<string, number>();

  for (let i = 0; i < queue.length; i++) {
    const { pos: curr, steps } = queue[i]!;
    if (curr[0] === finish[0] && curr[1] === finish[1] && steps < best) {
      best = steps;
      continue;
    }
    getAround(curr).forEach(([x, y]) => {
      const key = [x, y].join(',');
      if (x > lim || y > lim || x < 0 || y < 0 || corrupted.has(key)) return;
      if (seen.has(key)) return;
      seen.set(key, steps + 1);
      const newSteps = steps + 1;
      if (newSteps >= best) return;
      queue.push({ pos: [x, y], steps: newSteps });
    });
  }

  return best;
};

const first = (raw: string) => runSearch(getData(raw), 1024);

const second = (raw: string) => {
  const data = getData(raw);

  for (let i = 1024; i < data.length; i++) {
    const res = runSearch(data, i);
    if (res === Infinity) return data[i - 1].join(',');
  }
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
