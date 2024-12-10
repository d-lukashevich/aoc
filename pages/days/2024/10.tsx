import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Pos = [number, number];

const getData = (raw: string) => {
  return parseRows(raw).map((row) => row.split('').map(Number));
};

const getTops = (data: number[][]) => {
  const countTops = ([x, y]: Pos): string[] => {
    const value = data[y]?.[x];
    if (value === 9) return [`${x},${y}`];
    const directions: Pos[] = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ];
    return directions.flatMap((pos) => {
      const nValue = data[pos[1]]?.[pos[0]];
      return nValue === value + 1 ? countTops(pos) : [];
    });
  };

  return data.flatMap((row, y) => {
    return row.map((cell, x) => (cell === 0 ? countTops([x, y]) : []));
  });
};

const first = (raw: string) => {
  return getTops(getData(raw)).reduce((acc, tops) => acc + new Set(tops).size, 0);
};

const second = (raw: string) => {
  return getTops(getData(raw)).reduce((acc, tops) => acc + tops.length, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
