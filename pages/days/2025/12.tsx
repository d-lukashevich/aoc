import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const first = (raw: string) => {
  return parseRows(raw).reduce((acc, row) => {
    if (row.length < 5) return acc;
    const [sizesRaw, countersRaw] = row.split(': ');
    const [x, y] = sizesRaw.split('x').map(Number) as [number, number];
    const counters = countersRaw.split(' ').map(Number);
    const total = counters.reduce((acc, counter) => acc + counter * 9, 0);
    return acc + +(x * y >= total);
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={first} />;
}
