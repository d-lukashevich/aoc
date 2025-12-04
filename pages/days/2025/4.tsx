import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  return parseRows(raw).map((str) => [...str]);
};

const getAdjacentCoords = (i: number, j: number) => {
  return [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ] as const;
};

const first = (raw: string) => {
  const rows = getData(raw);

  const countPosition = (i: number, j: number) => +(rows[i]?.[j] === '@');

  let counter = 0;

  rows.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== '@') return;
      const adjacentSum = getAdjacentCoords(i, j).reduce((sum, [x, y]) => {
        return sum + countPosition(x, y);
      }, 0);
      if (adjacentSum < 4) counter++;
    });
  });

  return counter;
};

const second = (raw: string) => {
  const rows = getData(raw);
  let globalCounter = 0;

  const countPosition = (i: number, j: number) => +(rows[i]?.[j] === '@');

  const runCheck = () => {
    let counter = 0;
    rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== '@') return;
        const adjacentSum = getAdjacentCoords(i, j).reduce((sum, [x, y]) => {
          return sum + countPosition(x, y);
        }, 0);
        if (adjacentSum < 4) {
          counter++;
          rows[i][j] = '.';
        }
      });
    });
    if (counter > 0) {
      globalCounter += counter;
      counter = 0;
      runCheck();
    }
  };

  runCheck();

  return globalCounter;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
