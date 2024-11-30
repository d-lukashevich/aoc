import { PuzzleRenderer } from '@units/PuzzleRenderer';

const getData = (raw: string) =>
  raw
    .split(',')
    .map(Number)
    .sort((a, b) => a - b);

const findOptimum = (raw: string, calcFuel: (distance: number) => number) => {
  const nums = getData(raw);

  const count = (pos: number) => nums.reduce((acc, num) => acc + calcFuel(Math.abs(num - pos)), 0);

  const search = (bottom: number, top: number): number => {
    if (bottom === top) return count(bottom);
    const midLeft = Math.floor((bottom + top) / 2);
    const midRight = midLeft + 1;

    return count(midLeft) < count(midRight) ? search(bottom, midLeft) : search(midRight, top);
  };

  return search(nums.at(0)!, nums.at(-1)!);
};

const first = (raw: string) => findOptimum(raw, (distance) => distance);
const second = (raw: string) => findOptimum(raw, (distance) => (distance ** 2 + distance) / 2);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
