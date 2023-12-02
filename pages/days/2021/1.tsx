import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const first = (raw: string) => {
  const rows = parseRows(raw);
  let counter = -1;
  let prev = -Infinity;
  rows.forEach((num) => {
    const n = Number(num);
    if (n > prev) counter++;
    prev = n;
  });
  return counter;
};

const second = (raw: string) => {
  const rows = parseRows(raw);
  let counter = -1;
  let prev = -Infinity;
  for (let i = 2; i < rows.length; i++) {
    const n = Number(rows[i]) + Number(rows[i - 1]) + Number(rows[i - 2]);
    if (n > prev) counter++;
    prev = n;
  }
  return counter;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
