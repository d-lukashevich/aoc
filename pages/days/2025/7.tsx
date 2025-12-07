import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map((row) => [...row]);

const first = (raw: string) => {
  const rows = getData(raw);
  let positions = new Set([rows[0].indexOf('S')]);
  let counter = 0;

  rows.forEach((row) => {
    const newPositions = new Set<number>();
    row.forEach((char, i) => {
      if (!positions.has(i)) return;
      if (char === '^') {
        counter++;
        newPositions.add(i - 1);
        newPositions.add(i + 1);
      } else {
        newPositions.add(i);
      }
    });
    positions = newPositions;
  });

  return counter;
};

const second = (raw: string) => {
  const rows = getData(raw);
  let positions = new Map([[rows[0].indexOf('S'), 1]]);

  rows.forEach((row) => {
    const newPositions = new Map<number, number>();
    const addPosition = (i: number, timelines: number) => {
      newPositions.set(i, (newPositions.get(i) ?? 0) + timelines);
    };

    row.forEach((char, i) => {
      const timelines = positions.get(i);
      if (!timelines) return;
      if (char === '^') {
        addPosition(i - 1, timelines);
        addPosition(i + 1, timelines);
      } else {
        addPosition(i, timelines);
      }
    });
    positions = newPositions;
  });

  return [...positions.values()].reduce((a, b) => a + b);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
