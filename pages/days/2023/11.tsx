import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw).map((row) => [...row]);
  const galaxies = rows.reduce((acc: [number, number][], row, i) => {
    row.forEach((char, j) => {
      if (char === '#') acc.push([i, j]);
    });
    return acc;
  }, []);
  const emptyLines = rows.reduce((acc: number[], row, i) => {
    if (row.every((char) => char === '.')) acc.push(i);
    return acc;
  }, []);
  const emptyCols: number[] = [];
  for (let i = 0; i < rows[0].length; i++) {
    for (let j = 0; j < rows.length; j++) {
      if (rows[j][i] === '#') break;
      if (j === rows.length - 1) emptyCols.push(i);
    }
  }

  return { galaxies, emptyLines, emptyCols };
};

const isBetween = (a: number, b: number, num: number) => {
  return Math.min(a, b) < num && Math.max(a, b) > num;
};

const countPaths = (raw: string, expansion: number) => {
  const { galaxies, emptyLines, emptyCols } = getData(raw);
  const paths: number[] = [];
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [x1, y1] = galaxies[i];
      const [x2, y2] = galaxies[j];
      let path = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      emptyLines.forEach((line) => {
        if (isBetween(x1, x2, line)) path += expansion;
      });
      emptyCols.forEach((col) => {
        if (isBetween(y1, y2, col)) path += expansion;
      });

      paths.push(path);
    }
  }

  return paths.reduce((acc, path) => acc + path, 0);
};

const first = (raw: string) => countPaths(raw, 1);
const second = (raw: string) => countPaths(raw, 999999);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
