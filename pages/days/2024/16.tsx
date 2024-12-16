import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  let finish: Point;
  let start: Point;
  const data = parseRows(raw).map((row, y) => {
    return [...row].map((cell, x) => {
      if (cell === 'S') start = [x, y];
      if (cell === 'E') finish = [x, y];
      return cell === '#' ? '#' : '.';
    });
  });
  // @ts-ignore
  if (!finish || !start) throw new Error('Invalid input');
  return { data, start, finish };
};

type Direction = 'N' | 'E' | 'S' | 'W';
type Point = [number, number];

type Pos = {
  point: Point;
  direction: Direction;
  score: number;
  prev?: Pos;
};

const getAround = ([x, y]: Point) => [
  [x, y - 1],
  [x + 1, y],
  [x, y + 1],
  [x - 1, y],
];
const directions: Direction[] = ['N', 'E', 'S', 'W'];

const solve = (raw: string) => {
  const { start, finish, data } = getData(raw);
  const encodeCase = ({ point, direction }: Pos) => {
    return `${point.join(',')},${direction}`;
  };
  const seen = new Map<string, number>();
  const addToSeen = (pos: Pos) => {
    const key = encodeCase(pos);
    const stored = seen.get(key);
    if (stored !== undefined && stored < pos.score) return false;
    seen.set(key, pos.score);
    return true;
  };

  const stack: Pos[] = [{ point: start, direction: 'E', score: 0 }];

  const addNextPositions = (pos: Pos) => {
    getAround(pos.point).forEach(([x, y], i) => {
      const val = data[y]?.[x];
      if (val !== '.' || (x === pos.point[0] && y === pos.point[1])) return;
      const direction = directions[i];
      const score = pos.score + 1 + (pos.direction === direction ? 0 : 1000);
      if (score > best) return;
      stack.push({
        point: [x, y],
        direction,
        score,
        prev: pos,
      });
    });
  };

  let best = Infinity;
  let bestSet = new Set<string>();

  while (stack.length) {
    const curr = stack.pop()!;
    if (!addToSeen(curr) || curr.score > best) continue;
    if (curr.point.join() !== finish.join()) {
      addNextPositions(curr);
      continue;
    }
    if (curr.score < best) {
      bestSet = new Set<string>();
      best = curr.score;
    }
    if (curr.score === best) {
      const checkPos = (pos: Pos) => {
        bestSet.add(pos.point.join(','));
        if (!pos.prev) return;
        checkPos(pos.prev);
      };
      checkPos(curr);
    }
  }

  return `Best score: ${best}; Best spots: ${bestSet.size}`;
};

export default function Day() {
  return <PuzzleRenderer func={solve} first={solve} second={solve} />;
}
