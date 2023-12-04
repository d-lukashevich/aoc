import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const reg = /Card.+: (.+) \| (.+)$/;

const getNumsList = (str: string) =>
  str
    .split(' ')
    .filter((str) => str !== '')
    .map(Number);
const getData = (raw: string) => {
  return parseRows(raw).map((row) => {
    const [, nums, wins] = row.match(reg)!;
    return [getNumsList(nums), getNumsList(wins)] as const;
  });
};

const first = (raw: string) => {
  const data = getData(raw);
  const points = data.map(([nums, wins]) => {
    const hashNums = new Set(nums);
    const count = wins.filter((num) => hashNums.has(num)).length;
    return count < 2 ? count : 2 ** (count - 1);
  });
  return points.reduce((acc, num) => acc + num, 0);
};

const seconds = (raw: string) => {
  const data = getData(raw);
  const counters = new Array(data.length).fill(1);
  data.forEach(([nums, wins], i) => {
    const hashNums = new Set(nums);
    let winsCount = wins.filter((num) => hashNums.has(num)).length;
    while (winsCount) {
      if (counters[i + winsCount]) counters[i + winsCount] += counters[i];
      winsCount--;
    }
  });
  return counters.reduce((acc, num) => acc + num, 0);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={seconds} />;
}
