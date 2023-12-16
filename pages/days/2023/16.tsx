import { PuzzleRenderer } from '@units/PuzzleRenderer';

type Beam = [number, number, string];

const getData = (raw: string) => {
  const text = raw.trim().replaceAll('\\', 'r');
  const map: string[][] = [[]];
  for (const char of text) {
    if (char === '\n') {
      map.push([]);
    } else {
      map.at(-1)!.push(char);
    }
  }
  return map;
};

const getKey = (x: number, y: number, direction: string) => `${x},${y},${direction}`;

const handleDot = ([x, y, direction]: Beam): Beam => {
  if (direction === 'right') return [x + 1, y, direction];
  if (direction === 'left') return [x - 1, y, direction];
  if (direction === 'up') return [x, y - 1, direction];
  if (direction === 'down') return [x, y + 1, direction];
  throw new Error('Invalid direction');
};

const handleLeftMirror = ([x, y, direction]: Beam): Beam => {
  if (direction === 'right') return [x, y - 1, 'up'];
  if (direction === 'left') return [x, y + 1, 'down'];
  if (direction === 'up') return [x + 1, y, 'right'];
  if (direction === 'down') return [x - 1, y, 'left'];
  throw new Error('Invalid direction');
};

const handleRightMirror = ([x, y, direction]: Beam): Beam => {
  if (direction === 'right') return [x, y + 1, 'down'];
  if (direction === 'left') return [x, y - 1, 'up'];
  if (direction === 'up') return [x - 1, y, 'left'];
  if (direction === 'down') return [x + 1, y, 'right'];
  throw new Error('Invalid direction');
};

const handleVerticalMirror = ([x, y, direction]: Beam): Beam[] => {
  if (direction === 'right' || direction === 'left')
    return [
      [x, y - 1, 'up'],
      [x, y + 1, 'down'],
    ];
  return [handleDot([x, y, direction])];
};

const handleHorizontalMirror = ([x, y, direction]: Beam): Beam[] => {
  if (direction === 'up' || direction === 'down')
    return [
      [x - 1, y, 'left'],
      [x + 1, y, 'right'],
    ];
  return [handleDot([x, y, direction])];
};

const calcEnergize = (map: string[][], init: Beam) => {
  const beams: [number, number, string][] = [init];
  const visited = new Set<string>([getKey(...beams[0])]);
  const energized = new Set<string>([`${init[0]},${init[1]}`]);

  const isValidPos = (x: number, y: number) => {
    if (y < 0 || y >= map.length) return false;
    if (x < 0 || x >= map[y].length) return false;
    return true;
  };

  const addBeam = (beam: Beam) => {
    const key = getKey(...beam);
    if (!visited.has(key)) {
      visited.add(key);
      energized.add(`${beam[0]},${beam[1]}`);
      beams.push(beam);
    }
  };

  while (beams.length) {
    const beam = beams.shift()!;
    const char = map[beam[1]][beam[0]];

    const candidates: Beam[] = [];

    if (char === '.') candidates.push(handleDot(beam));
    if (char === '/') candidates.push(handleLeftMirror(beam));
    if (char === 'r') candidates.push(handleRightMirror(beam));
    if (char === '|') candidates.push(...handleVerticalMirror(beam));
    if (char === '-') candidates.push(...handleHorizontalMirror(beam));
    candidates.forEach((beam) => {
      if (isValidPos(beam[0], beam[1])) addBeam(beam);
    });
  }

  return energized.size;
};

const first = (raw: string) => calcEnergize(getData(raw), [0, 0, 'right']);

const second = (raw: string) => {
  const map = getData(raw);
  const beams: Beam[] = [];
  for (let i = 0; i < map.length; i++) {
    beams.push([0, i, 'right']);
    beams.push([map[i].length - 1, i, 'left']);
    beams.push([i, 0, 'down']);
    beams.push([i, map.length - 1, 'up']);
  }
  return beams.reduce((acc, beam) => Math.max(acc, calcEnergize(map, beam)), 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
