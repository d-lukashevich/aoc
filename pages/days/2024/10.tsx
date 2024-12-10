import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Pos = [number, number];

const getData = (raw: string) => {
  return parseRows(raw).map((row) => row.split('').map(Number));
};

const getTops = (data: number[][]) => {
  const heads: Pos[] = [];
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) heads.push([x, y]);
    });
  });

  const countTops = (pos: Pos) => {
    let tops = new Array<string>();
    const stack = [pos];
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const current = data[y][x];
      if (current === 9) {
        tops.push(`${x},${y}`);
        continue;
      }
      const directions: Pos[] = [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
      ];
      directions.forEach(([nx, ny]) => {
        const value = data[ny]?.[nx] ?? 0;
        if (value === current + 1) {
          stack.push([nx, ny]);
        }
      });
    }
    return tops;
  };

  return heads.map(countTops);
};

const first = (raw: string) => {
  const data = getData(raw);
  return getTops(data).reduce((acc, tops) => acc + new Set(tops).size, 0);
};

const second = (raw: string) => {
  const data = getData(raw);
  return getTops(data).reduce((acc, tops) => acc + tops.length, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
