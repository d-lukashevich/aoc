import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const first = (raw: string) => {
  const rows = parseRows(raw).map((row) => row.trim().split(new RegExp('\\s+')));
  const nums = rows.slice(0, rows.length - 1).map((row) => row.map(Number));
  const operations = rows.at(-1)!;

  const totals = operations.map((sign, i) => {
    return nums.reduce((acc, row) => (sign === '+' ? acc + row[i] : acc * row[i]), sign === '+' ? 0 : 1);
  });

  return totals.reduce((acc, row) => acc + row);
};

const second = (raw: string) => {
  const rows = parseRows(raw);
  const limit = Math.max(...rows.map((row) => row.length));

  let total = 0;
  let sign = '';
  let numbers: number[] = [];

  for (let i = 0; i < limit; i++) {
    let num = '';
    rows.forEach((row) => {
      const char = row[i];
      if (!char || char === ' ') return;
      if (char === '+' || char === '*') return (sign = char);
      num += char;
    });

    if (num) numbers.push(Number(num));
    if (!num || i === limit - 1) {
      total += numbers.reduce((acc, num) => (sign === '+' ? acc + num : acc * num), sign === '+' ? 0 : 1);
      numbers = [];
    }
    num = '';
  }

  return total;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
