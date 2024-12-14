import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const reg = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/;

const getData = (raw: string) => {
  return parseRows(raw).map((row) => {
    const [, x, y, vx, vy] = row.match(reg)!.map(Number);
    return { x, y, vx, vy };
  });
};

const xBase = 101;
const yBase = 103;

const first = (raw: string) => {
  const data = getData(raw);

  data.forEach((d) => {
    for (let i = 0; i < 100; i++) {
      d.x = (d.x + d.vx + xBase) % xBase;
      d.y = (d.y + d.vy + yBase) % yBase;
    }
  });

  const quadrants = data.reduce(
    (acc: [number, number, number, number], d) => {
      if (d.x <= Math.floor(xBase / 2) - 1 && d.y <= Math.floor(yBase / 2) - 1) acc[0]++;
      if (d.x >= Math.ceil(xBase / 2) && d.y <= Math.floor(yBase / 2) - 1) acc[1]++;
      if (d.x <= Math.floor(xBase / 2) - 1 && d.y >= Math.ceil(yBase / 2)) acc[2]++;
      if (d.x >= Math.ceil(xBase / 2) && d.y >= Math.ceil(yBase / 2)) acc[3]++;
      return acc;
    },
    [0, 0, 0, 0]
  );

  return quadrants.reduce((acc, q) => acc * q, 1);
};

const second = (raw: string) => {
  const data = getData(raw);

  const checkIsThereALine = () => {
    const grid = Array.from({ length: yBase }, () => Array.from({ length: xBase }, () => false));
    data.forEach((d) => (grid[d.y][d.x] = true));

    for (let i = 0; i < yBase; i++) {
      let count = 0;
      for (let j = 0; j < xBase; j++) {
        count = grid[i][j] ? count + 1 : 0;
        if (count > 15) return true;
      }
    }
    return false;
  };

  const doStep = () => {
    data.forEach((d) => {
      d.x = (d.x + d.vx + xBase) % xBase;
      d.y = (d.y + d.vy + yBase) % yBase;
    });
  };

  // `i` should just be high enough - see logs for candidates and check the full image on the drawing
  for (let i = 0; i < 7037; i++) {
    doStep();
    const isLine = checkIsThereALine();
    if (isLine) console.log('candidate', i + 1);
  }

  const draw = () => {
    const grid = Array.from({ length: yBase }, () => Array.from({ length: xBase }, () => '.'));
    data.forEach((d) => {
      grid[d.y][d.x] = '#';
    });
    return grid.map((row) => row.join('')).join('\n');
  };

  return draw();
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
