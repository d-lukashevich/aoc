import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  return parseRows(raw).map((str) => str.split('').map(Number));
};

const first = (raw: string) => {
  const rows = getData(raw).map((row) => {
    let best = 0;
    row.forEach((first, i) => {
      for (let j = i + 1; j < row.length; j++) {
        best = Math.max(best, Number(`${first}${row[j]}`));
      }
    });
    return best;
  });

  return rows.reduce((sum, row) => sum + row);
};

const second = (raw: string) => {
  const rows = getData(raw).map((row) => {
    let current = row.slice(0, 12);

    for (let i = 12; i < row.length; i++) {
      let best = Number(current.join(''));
      const newDigit = row[i]!;
      for (let j = 0; j < current.length; j++) {
        const candidateArr = current.toSpliced(j, 1);
        candidateArr.push(newDigit);
        best = Math.max(best, Number(candidateArr.join('')));
      }
      current = [...String(best)].map(Number);
    }

    return Number(current.join(''));
  });

  return rows.reduce((sum, row) => sum + row);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
