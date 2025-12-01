import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  return parseRows(raw).map((str) => {
    return [str[0], Number(str.slice(1))] as const;
  });
};

const first = (raw: string) => {
  const rows = getData(raw);

  let counter = 0;
  let acc = 50;

  for (let i = 0; i < rows.length; i++) {
    if (acc === 0) counter++;
    const [dir, value] = rows[i];
    if (dir === 'R') {
      acc = (acc + value) % 100;
    } else {
      acc = (((acc - value) % -100) + 100) % 100;
    }
  }
  return counter;
};

const second = (raw: string) => {
  const rows = getData(raw);

  let counter = 0;
  let acc = 50;
  rows.forEach(([dir, value]) => {
    if (dir === 'R') {
      const temp = acc + value;
      counter += Math.floor(temp / 100);
      acc = temp % 100;
    } else {
      if (acc !== 0) counter++;
      const temp = acc - value;
      counter += Math.floor(temp / -100);
      acc = ((temp % -100) + 100) % 100;
    }
  });

  return counter;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
