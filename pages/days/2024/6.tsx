import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const data = parseRows(raw).map((row) => row.split(''));

  const start: [number, number] = (() => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (cell === '^') return [j, i];
      }
    }
  })()!;

  return { data, start };
};

const getNextPosition = ([x, y]: [number, number], direction: (typeof directions)[number]): [number, number] => {
  if (direction === 'u') return [x, y - 1] as const;
  if (direction === 'r') return [x + 1, y] as const;
  if (direction === 'b') return [x, y + 1] as const;
  return [x - 1, y] as const;
};

const directions = ['u', 'r', 'b', 'l'] as const;

const first = (raw: string) => {
  const { data, start } = getData(raw);

  let position: [number, number] = [...start];
  let direction: (typeof directions)[number] = 'u';
  const positions = new Set<string>();

  for (let i = 0; i < 10000; i++) {
    const [x, y] = position;
    const cell = data[y]?.[x];
    if (!cell) return positions.size;

    let nextCell = getNextPosition(position, direction);
    while (data[nextCell[1]]?.[nextCell[0]] === '#') {
      direction = directions[(directions.indexOf(direction) + 1) % 4];
      nextCell = getNextPosition(position, direction);
    }

    positions.add(position.join(','));
    position = [...nextCell];
  }

  return positions.size;
};

// ugly brute force
const second = (raw: string) => {
  const { data, start } = getData(raw);

  let count = 0;

  data.forEach((row, y) => {
    row.forEach((blockCell, x) => {
      if (blockCell !== '.') return;
      const block = [x, y];

      let position = start;
      let direction: (typeof directions)[number] = 'u';
      const positions = new Set<string>();

      for (let i = 0; i < 10000; i++) {
        const [x, y] = position;
        const cell = data[y]?.[x];
        if (!cell) return;

        let nextCell = getNextPosition(position, direction);
        while (data[nextCell[1]]?.[nextCell[0]] === '#' || (nextCell[0] === block[0] && nextCell[1] === block[1])) {
          direction = directions[(directions.indexOf(direction) + 1) % 4];
          nextCell = getNextPosition(position, direction);
        }

        const hash = [...position, direction].join();
        if (positions.has(hash)) {
          count++;
          break;
        }
        positions.add(hash);
        position = nextCell;
      }
    });
  });

  return count;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
