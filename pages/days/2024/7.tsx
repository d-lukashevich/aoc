import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw).map((row) => row.split(': '));
  return rows.map(([summary, numsStr]) => {
    return { summary: Number(summary), nums: numsStr.split(' ').map((num) => parseInt(num)) };
  });
};

const constructSolution = (resolver: (a: number, b: number) => number[]) => {
  return (raw: string) => {
    const data = getData(raw);

    const calc = ([first, ...rest]: number[], limit: number) => {
      if (!rest.length) return new Set([first]);
      const result = new Set<number>();
      calc(rest, limit).forEach((num) => {
        resolver(num, first).forEach((num) => num <= limit && result.add(num));
      });

      return result;
    };

    return data.reduce((acc, { summary, nums }) => {
      return calc(nums.reverse(), summary).has(summary) ? acc + summary : acc;
    }, 0);
  };
};

const first = constructSolution((a, b) => [a + b, a * b]);
const second = constructSolution((a, b) => [a + b, a * b, Number(`${a}${b}`)]);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
