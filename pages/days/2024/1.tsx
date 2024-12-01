import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  return parseRows(raw).map((row) => {
    return row.split('   ').map((str) => Number(str)) as [number, number];
  });
};

const first = (raw: string) => {
  const data = getData(raw);
  const firsts = data.map(([a]) => a).sort((a, b) => a - b);
  const seconds = data.map(([, b]) => b).sort((a, b) => a - b);

  return firsts.reduce((acc, first, i) => acc + Math.abs(first - seconds[i]!), 0);
};

const second = (raw: string) => {
  const data = getData(raw);

  const counters = data.reduce((acc, [, second]) => {
    return acc.set(second, (acc.get(second) || 0) + 1);
  }, new Map<number, number>());

  return data.reduce((acc, [first]) => first * (counters.get(first) || 0) + acc, 0);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
