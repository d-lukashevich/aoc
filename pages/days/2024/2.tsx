import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { getNumsList, parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map(getNumsList);

const checkRow = (row: number[]) => {
  const isIncrease = row[0] < row[1];
  for (let i = 1; i < row.length; i++) {
    const diff = row[i] - row[i - 1];
    if (!diff) return 0;
    if (Math.abs(diff) > 3) return 0;
    if (isIncrease !== diff > 0) return 0;
  }
  return 1;
};

const first = (raw: string) => getData(raw).reduce((acc, row) => acc + checkRow(row), 0);

const second = (raw: string) => {
  return getData(raw).reduce((acc, row) => {
    return acc + +row.some((_, i) => checkRow(row.toSpliced(i, 1)));
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
