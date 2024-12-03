import { PuzzleRenderer } from '@units/PuzzleRenderer';

const mulReg = /mul\((\d+),(\d+)\)/g;
const doReg = /do\(\)/g;
const dontReg = /don't\(\)/g;

const first = (raw: string) => {
  return [...raw.matchAll(mulReg)].reduce((acc, [, a, b]) => acc + Number(a) * Number(b), 0);
};

const second = (raw: string) => {
  const arr = [...raw.matchAll(mulReg), ...raw.matchAll(doReg), ...raw.matchAll(dontReg)].sort(
    (a, b) => a.index - b.index
  );

  let isEnabled = true;
  let sum = 0;
  arr.forEach(([match, a, b]) => {
    if (!a) return (isEnabled = match === 'do()');
    if (isEnabled) sum += Number(a) * Number(b);
  });

  return sum;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
