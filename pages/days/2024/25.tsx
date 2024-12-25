import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const locks: number[][] = [];
  const keys: number[][] = [];

  let draft = new Array<number>(5).fill(-1);
  const rows = parseRows(raw);
  const addDraft = (i: number) => (rows.at(i)?.[0] === '#' ? locks : keys).push(draft);
  rows.forEach((row, i) => {
    if (!row) {
      addDraft(i - 1);
      return (draft = new Array<number>(5).fill(-1));
    }
    [...row].forEach((char, j) => {
      draft[j] += char === '#' ? 1 : 0;
    });
  });
  addDraft(-1);

  return { locks, keys };
};

const first = (raw: string) => {
  const { locks, keys } = getData(raw);
  let counter = 0;
  locks.forEach((lock) => {
    keys.forEach((key) => {
      if (lock.every((l, i) => l + key[i] < 6)) counter++;
    });
  });
  return counter;
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={first} />;
}
