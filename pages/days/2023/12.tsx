import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

const rowRegex = /(.+) (.+)/;

const getData = (raw: string) => {
  return parseRows(raw).map((row) => {
    const [, line, numsStr] = rowRegex.exec(row)!;
    return { line, nums: numsStr.split(',').map(Number) };
  });
};

const count = withCache((line: string, nums: number[]): number => {
  if (line.length === 0) return +!nums.length;
  if (nums.length === 0) return +!line.includes('#');

  const sum = nums.reduce((acc, num) => acc + num) + nums.length - 1;
  if (line.length < sum) return 0;

  if (line[0] === '.') return count(line.slice(1), nums);
  if (line[0] === '#') {
    const [num, ...rest] = nums;
    for (let i = 0; i < num; i++) {
      if (line[i] === '.') return 0;
    }
    if (line[num] === '#') return 0;

    return count(line.slice(num + 1), rest);
  }

  // ? case
  const restLine = line.slice(1);
  return count(`#${restLine}`, nums) + count(`.${restLine}`, nums);
});

const first = (raw: string) => {
  return getData(raw).reduce((acc, { line, nums }) => count(line, nums) + acc, 0);
};

const second = (raw: string) => {
  const data = getData(raw);

  return data.reduce((acc: number, row) => {
    const line = new Array(5).fill(row.line).join('?');
    const nums = new Array(5).fill(row.nums).flat();
    return acc + count(line, nums);
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
