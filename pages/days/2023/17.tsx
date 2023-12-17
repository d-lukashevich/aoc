import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map((row) => [...row].map(Number));

type Direction = 'up' | 'down' | 'left' | 'right';
type Position = { x: number; y: number; inertia: number; loss: number; direction: Direction };

const directions = ['up', 'down', 'left', 'right'] as const;
const oppositeDirs = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
} as const;

const getSolver = (max: number, min = -1) => {
  return (raw: string) => {
    const map = getData(raw);

    const getDirection = (direction: Direction, inertia: number) => {
      if (inertia < min) return [direction];
      return directions.filter((dir: Direction) => {
        if (dir === direction && inertia >= max) return false;
        return dir !== oppositeDirs[direction];
      });
    };

    const positions: Position[] = [
      { x: 1, y: 0, inertia: 0, loss: 0, direction: 'right' },
      { x: 0, y: 1, inertia: 0, loss: 0, direction: 'down' },
    ];
    let candidate = Infinity;
    const visited: Record<string, [number, number]> = {};

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      delete positions[i];
      let { x, y, inertia, loss, direction } = position;
      const upd = map[y]?.[x];
      if (upd === undefined) continue;
      loss += upd;
      inertia += 1;
      if (loss > candidate) continue;

      if (x === map[0].length - 1 && y === map.length - 1 && inertia >= min) {
        candidate = Math.min(candidate, loss);
        continue;
      }
      const key = `${x},${y},${direction},${inertia}`;
      if (visited[key]) {
        const [prevLoss] = visited[key];
        if (prevLoss <= loss) continue;
        visited[key] = [loss, inertia];
      } else {
        visited[key] = [loss, inertia];
      }

      getDirection(direction, inertia).forEach((dir) => {
        const newInertia = dir === direction ? inertia : 0;
        switch (dir) {
          case 'up':
            positions.push({ x, y: y - 1, inertia: newInertia, loss, direction: 'up' });
            break;
          case 'down':
            positions.push({ x, y: y + 1, inertia: newInertia, loss, direction: 'down' });
            break;
          case 'left':
            positions.push({ x: x - 1, y, inertia: newInertia, loss, direction: 'left' });
            break;
          case 'right':
            positions.push({ x: x + 1, y, inertia: newInertia, loss, direction: 'right' });
            break;
        }
      });
    }

    return candidate;
  };
};

const first = getSolver(3);
const second = getSolver(10, 4);

const placeholder = () => {
  return "It's extremely slow (about 40s for p1 and about 3m for p2), so I'll leave a placeholder here.";
};

export default function Day() {
  return <PuzzleRenderer func={placeholder} first={first} second={second} />;
}
