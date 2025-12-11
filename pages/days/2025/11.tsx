import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

const getData = (raw: string) => {
  return parseRows(raw).reduce((map, row) => {
    const [key, rest] = row.split(': ');
    return map.set(key, rest.split(' '));
  }, new Map<string, string[]>());
};

const first = (raw: string) => {
  const map = getData(raw);
  const solver = (key: string): number => (key === 'out' ? 1 : map.get(key)!.reduce((a, b) => a + solver(b), 0));
  return solver('you');
};

const second = (raw: string) => {
  const map = getData(raw);
  const solver = withCache((key: string, hasFft: boolean, hasDac: boolean): number => {
    if (key === 'fft') hasFft = true;
    if (key === 'dac') hasDac = true;
    if (key === 'out') return +(hasDac && hasFft);
    return map.get(key)!.reduce((a, b) => a + solver(b, hasFft, hasDac), 0);
  });
  return solver('svr', false, false);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
