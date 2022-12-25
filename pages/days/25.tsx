import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

const getData = (raw: string): string[] => {
  return raw.split('\n');
};

const Chars: Record<string, number> = {
  '=': -2,
  '-': -1,
  0: 0,
  1: 1,
  2: 2,
};
const Nums: Record<number, string> = {
  '-2': '=',
  '-1': '-',
  0: '0',
  1: '1',
  2: '2',
};

const decode = (str: string) => {
  let result = 0;
  const len = str.length - 1;
  for (let i = 0; i <= len; i++) {
    result += Chars[str[i]] * Math.pow(5, len - i);
  }
  return result;
};

const brs = new Array(25).fill(0).reduce((acc: number[], _, i) => {
  acc.push(2 * Math.pow(5, i) + (acc[i - 1] || 0));
  return acc;
}, []);

const nums = [-2, -1, 0, 1, 2];
const encode = (num: number) => {
  let result = '';
  let power = brs.findIndex((br) => br >= num);
  while (power >= 0) {
    const index = nums.findIndex(
      (candidate) => Math.abs(num - candidate * Math.pow(5, power)) <= (brs[power - 1] || 0)
    );
    num -= nums[index] * Math.pow(5, power);
    result = `${result}${Nums[nums[index]]}`;
    power--;
  }

  return result;
};

const solveFirst = (raw: string) => {
  const data = getData(raw);
  return encode(data.map(decode).reduce((acc, num) => acc + num));
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={25} func={solveFirst} first={solveFirst} second={solveFirst} />
    </Layout>
  );
}
