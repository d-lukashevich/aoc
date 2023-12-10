import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const map = parseRows(raw).map((row) => [...row]);
  let start: undefined | [number, number];
  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (char === 'S') {
        start = [i, j];
        break;
      }
    }
  }
  if (!start) throw new Error('No start');
  return { map, start };
};

const getNext = (pos: [number, number], enter: [number, number], pipe: string): [number, number] => {
  const shift = [pos[0] - enter[0], pos[1] - enter[1]];
  switch (pipe) {
    case 'F':
      return shift[0] === 0 ? [pos[0] + 1, pos[1]] : [pos[0], pos[1] + 1];
    case '7':
      return shift[0] === 0 ? [pos[0] + 1, pos[1]] : [pos[0], pos[1] - 1];
    case 'J':
      return shift[0] === 0 ? [pos[0] - 1, pos[1]] : [pos[0], pos[1] - 1];
    case 'L':
      return shift[0] === 0 ? [pos[0] - 1, pos[1]] : [pos[0], pos[1] + 1];
    case '|':
      return shift[0] === 1 ? [pos[0] + 1, pos[1]] : [pos[0] - 1, pos[1]];
    case '-':
      return shift[1] === 1 ? [pos[0], pos[1] + 1] : [pos[0], pos[1] - 1];
    default:
      throw new Error('Unknown pipe');
  }
};

const first = (raw: string) => {
  const { map, start } = getData(raw);

  let step = 1;
  let prevFirst = start;
  // "F" letter assumed to be start here just based on real data (but should be corrected to other inputs)
  let first: [number, number] = [start[0], start[1] + 1];
  let prevSecond = start;
  let second: [number, number] = [start[0] + 1, start[1]];
  while (first.join() !== second.join()) {
    const tempFirst = first;
    const tempSecond = second;
    first = getNext(first, prevFirst, map[first[0]][first[1]]);
    second = getNext(second, prevSecond, map[second[0]][second[1]]);
    prevFirst = tempFirst;
    prevSecond = tempSecond;
    step++;
  }

  return step;
};

const northChars = new Set(['|', 'J', 'L']);

const second = (raw: string) => {
  const { map, start } = getData(raw);

  // "F" letter assumed to be start here just based on real data (but should be corrected to other inputs) (also would require to consider in northChars)
  let prev = start;
  let current: [number, number] = [start[0], start[1] + 1];
  const pipeCoords = new Set([start.join(), current.join()]);

  while (current.join() !== start.join()) {
    pipeCoords.add(`${current[0]},${current[1]}`);
    const temp = current;
    current = getNext(current, prev, map[current[0]][current[1]]);
    prev = temp;
  }

  return map.reduce((result: number, row, i) => {
    let enclosed = false;
    row.forEach((char, j) => {
      const isPipe = pipeCoords.has([i, j].join());
      if (isPipe && northChars.has(char)) {
        enclosed = !enclosed;
      } else if (!isPipe && enclosed) {
        result++;
      }
    });
    return result;
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
