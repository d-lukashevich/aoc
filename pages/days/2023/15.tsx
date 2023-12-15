import { PuzzleRenderer } from '@units/PuzzleRenderer';

const hash = (string: string) => {
  let result = 0;
  for (const symbol of string) result = ((symbol.charCodeAt(0) + result) * 17) % 256;
  return result;
};

const first = (raw: string) => {
  return raw.split(',').reduce((acc, row) => acc + hash(row), 0);
};

const regex = /(.+)([=-])(\d*)/;

const second = (raw: string) => {
  const boxes = raw.split(',').reduce(
    (acc, row) => {
      const [_, label, sign, value] = row.match(regex)!;
      const box = acc[hash(label)];
      if (sign === '=') box.set(label, Number(value));
      if (sign === '-') box.delete(label);
      return acc;
    },
    new Array(256).fill(0).map(() => new Map<string, number>())
  );

  return boxes.reduce((acc, box, i) => {
    [...box].forEach(([_, focal], j) => {
      acc += focal * (1 + j) * (1 + i);
    });
    return acc;
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
