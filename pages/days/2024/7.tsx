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

    const calc = (nums: number[], limit: number) => {
      const stack: number[][] = [nums];

      while (stack.length) {
        const [a, b, ...rest] = stack.pop()!;
        if (a > limit) continue;
        if (b === undefined) {
          if (a === limit) return true;
          continue;
        }
        resolver(a, b).forEach((res) => stack.push([res, ...rest]));
      }
      return false;
    };

    return data.reduce((acc, { summary, nums }) => {
      return calc(nums, summary) ? acc + summary : acc;
    }, 0);
  };
};

const first = constructSolution((a, b) => [a + b, a * b]);
const second = constructSolution((a, b) => [a + b, a * b, Number(`${a}${b}`)]);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
