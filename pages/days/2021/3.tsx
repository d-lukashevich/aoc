import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const first = (raw: string) => {
  const rows = parseRows(raw);
  const counters = rows.reduce((acc, str) => {
    acc.forEach((_, i) => {
      if (str[i] === '1') acc[i]++;
    });
    return acc;
  }, new Array(rows[0].length).fill(0));

  const gamma = counters.map((num) => (num * 2 < rows.length ? '0' : '1'));
  const epsilon = gamma.map((num) => (num === '1' ? '0' : '1'));

  return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
};

const second = (raw: string) => {
  const rows = parseRows(raw);

  let oxygen = '';
  let scrubber = '';
  let arr = rows;

  for (let i = 0; i < rows[0].length; i++) {
    const counter = arr.reduce((acc, str) => acc + +(str[i] === '1'), 0);
    const result = counter * 2 >= arr.length ? '1' : '0';
    oxygen += result;
    arr = arr.filter((str) => str[i] === result);
    if (arr.length === 1) {
      oxygen += arr[0].slice(i + 1);
      break;
    }
  }

  arr = rows;

  for (let i = 0; i < rows[0].length; i++) {
    const counter = arr.reduce((acc, str) => acc + +(str[i] === '0'), 0);
    const result = counter * 2 <= arr.length ? '0' : '1';
    scrubber += result;
    arr = arr.filter((str) => str[i] === result);
    if (arr.length === 1) {
      scrubber += arr[0].slice(i + 1);
      break;
    }
  }

  return parseInt(oxygen, 2) * parseInt(scrubber, 2);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
