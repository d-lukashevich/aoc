import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const reg = /(forward|down|up) (\d+)/;

const first = (raw: string) => {
  const rows = parseRows(raw);
  let x = 0;
  let y = 0;
  rows.forEach((row) => {
    const [, dir, val] = reg.exec(row)!;
    switch (dir) {
      case 'forward':
        x += Number(val);
        break;
      case 'down':
        y += Number(val);
        break;
      case 'up':
        y -= Number(val);
        break;
    }
  });
  return x * y;
};

const second = (raw: string) => {
  const rows = parseRows(raw);
  let aim = 0;
  let x = 0;
  let y = 0;
  rows.forEach((row) => {
    const [, dir, val] = reg.exec(row)!;
    switch (dir) {
      case 'forward':
        x += Number(val);
        y += aim * Number(val);
        break;
      case 'down':
        aim += Number(val);
        break;
      case 'up':
        aim -= Number(val);
        break;
    }
  });
  return x * y;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
