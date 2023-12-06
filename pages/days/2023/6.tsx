import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { getNumsList, parseRows } from '@utils';

const reg = /:(.+)$/;

const getData = (raw: string) => {
  return parseRows(raw).map((row) => getNumsList(row.match(reg)?.[1]!));
};

const countMargin = (time: number, distance: number) => {
  let counter = 0;
  for (let speed = 1; speed <= time; speed++) {
    const traveled = (time - speed) * speed;
    if (traveled > distance) counter++;
  }
  return counter;
};

const concatNumbers = (nums: number[]) => Number(nums.reduce((acc, num) => `${acc}${num}`, ''));

const first = (raw: string) => {
  const [times, distances] = getData(raw);
  return times.reduce((acc, time, i) => acc * countMargin(time, distances[i]), 1);
};

const second = (raw: string) => {
  const [time, distance] = getData(raw).map(concatNumbers);
  return countMargin(time, distance);
};

// Smells like brute forcing =)

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
