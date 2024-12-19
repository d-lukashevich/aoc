import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

const getData = (raw: string) => {
  const data = parseRows(raw);
  const patterns = data[0].split(', ');
  const towels = data.slice(2);
  return { patterns, towels };
};

const getCombinations = (raw: string) => {
  const { towels, patterns } = getData(raw);
  const checkDesign = withCache((str: string): number => {
    if (!str) return 1;
    return patterns.reduce((count, pattern) => {
      if (str.startsWith(pattern)) return checkDesign(str.slice(pattern.length)) + count;
      return count;
    }, 0);
  });
  return towels.map((towel) => checkDesign(towel));
};

const first = (raw: string) => {
  return getCombinations(raw).reduce((acc, val) => acc + +(val > 0), 0);
};

const second = (raw: string) => {
  return getCombinations(raw).reduce((acc, val) => acc + val, 0);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
