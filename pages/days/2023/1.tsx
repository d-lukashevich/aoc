import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const first = (raw: string) => {
  const data = parseRows(raw);

  const nums = data.map((str) => {
    let left: number | undefined;
    let right: number | undefined;
    let i = 0;
    while ((!left || !right) && i < str.length) {
      left ??= isNaN(Number(str[i])) ? undefined : Number(str[i]);
      right ??= isNaN(Number(str[str.length - i - 1])) ? undefined : Number(str[str.length - i - 1]);
      i++;
    }
    if (!left || !right) throw new Error('Invalid input');
    return Number(`${left}${right}`);
  });

  return nums.reduce((acc, num) => {
    return acc + num;
  });
};

const values: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

const second = (raw: string) => {
  const data = parseRows(raw);

  const nums = data.map((str) => {
    let left: number | undefined;
    let right: number | undefined;

    // This should be optimized to not check known impossible values
    for (let i = 1; i <= str.length; i++) {
      if (left) break;
      for (let j = 0; j < i; j++) {
        const candidate = str.slice(j, i);
        left ??= values[candidate];
        if (left) break;
      }
    }

    for (let i = str.length; i > 0; i--) {
      if (right) break;
      for (let j = i - 1; j >= 0; j--) {
        const candidate = str.slice(j, i);
        right ??= values[candidate];
        if (right) break;
      }
    }
    if (!left || !right) throw new Error('Invalid input');
    return Number(`${left}${right}`);
  });

  return nums.reduce((acc, num) => acc + num);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
