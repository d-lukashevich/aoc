import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { withCache } from '@utils';

const blink = (num: number): number[] => {
  if (num === 0) return [1];
  const str = num.toString();
  if (str.length % 2 === 0) {
    return [str.slice(0, str.length / 2), str.slice(str.length / 2)].map(Number);
  }
  return [num * 2024];
};

const doBlinks = withCache((arr: number[], depth: number): number => {
  if (!depth) return arr.length;
  return arr.reduce((acc, num) => {
    const sub = blink(num);
    return acc + doBlinks(sub, depth - 1);
  }, 0);
});

const makeSolution = (times: number) => {
  return (raw: string) => {
    const data = raw.split(' ').map(Number);
    return doBlinks(data, times);
  };
};

const first = makeSolution(25);
const second = makeSolution(75);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
