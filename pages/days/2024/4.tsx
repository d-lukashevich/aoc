import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const data = parseRows(raw);
  return data.map((row) => row.split(''));
};

const isXmasArr = (arr: (string | undefined)[]) => {
  const joined = arr.join('');
  return joined === 'XMAS' || joined === 'SAMX';
};

const isMasArr = (arr: (string | undefined)[]) => {
  const joined = arr.join('');
  return joined === 'MAS' || joined === 'SAM';
};

const first = (raw: string) => {
  const data = getData(raw);
  const pool = new Array<(string | undefined)[]>();
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      pool.push([cell, data[y]?.[x + 1], data[y]?.[x + 2], data[y]?.[x + 3]]);
      pool.push([cell, data[y + 1]?.[x], data[y + 2]?.[x], data[y + 3]?.[x]]);
      pool.push([cell, data[y + 1]?.[x + 1], data[y + 2]?.[x + 2], data[y + 3]?.[x + 3]]);
      pool.push([cell, data[y + 1]?.[x - 1], data[y + 2]?.[x - 2], data[y + 3]?.[x - 3]]);
    });
  });

  return pool.reduce((acc, arr) => {
    const strArr = arr.filter((cell): cell is string => cell !== undefined);
    if (strArr.length !== 4) return acc;
    return acc + +isXmasArr(strArr);
  }, 0);
};

const second = (raw: string) => {
  const data = getData(raw);
  const pool = new Array<(string | undefined)[]>();
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      pool.push([cell, data[y]?.[x + 2], data[y + 1]?.[x + 1], data[y + 2]?.[x], data[y + 2]?.[x + 2]]);
    });
  });

  return pool.reduce((acc, arr) => {
    return acc + +(isMasArr([arr[0], arr[2], arr[4]]) && isMasArr([arr[1], arr[2], arr[3]]));
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
