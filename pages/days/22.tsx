import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Order = number | ('R' | 'L');

const directions = ['up', 'right', 'down', 'left'];

const facings: Record<string, number> = {
  up: 3,
  right: 0,
  down: 1,
  left: 2,
};
const calcPassword = ([y, x]: [number, number], direction: string) => {
  return 1000 * (y + 1) + 4 * (x + 1) + facings[direction];
};

const getDirection = (current: string, turn: 'R' | 'L') => {
  const currentIndex = directions.indexOf(current);
  if (currentIndex === -1) throw new Error('Wrong current direction');
  return directions.at((currentIndex + (turn === 'R' ? 1 : -1)) % directions.length) as string;
};

const getNextPosition = (current: [number, number], direction: string): [number, number] => {
  const copy: [number, number] = [...current];
  const index = direction === 'up' || direction === 'down' ? 0 : 1;
  const addon = direction === 'down' || direction === 'right' ? 1 : -1;
  copy[index] += addon;
  return copy;
};

const isValidPoint = (point: string | undefined) => point === '.' || point === '#';

const getWrapPosition = (current: [number, number], direction: string, map: string[][]): [number, number] => {
  const copy: [number, number] = [...current];
  switch (direction) {
    case 'down': {
      copy[0] = map.findIndex((row) => isValidPoint(row[copy[1]]));
      return copy;
    }
    case 'right': {
      copy[1] = map[copy[0]].findIndex(isValidPoint);
      return copy;
    }
    case 'up': {
      for (let i = map.length - 1; i >= 0; i--) {
        if (isValidPoint(map[i]?.[copy[1]])) {
          copy[0] = i;
          return copy;
        }
      }
      throw new Error('Error in map position');
    }
    case 'left': {
      for (let i = map[0].length - 1; i >= 0; i--) {
        if (isValidPoint(map[copy[0]]?.[i])) {
          copy[1] = i;
          return copy;
        }
      }
      throw new Error('Error in map position');
    }
  }
  throw new Error('Impossible direction');
};

const cubesCoords: Record<string, [number, number]> = {
  1: [0, 50],
  2: [0, 100],
  3: [50, 50],
  4: [100, 50],
  5: [100, 0],
  6: [150, 0],
};

const getDestination = (
  direction: string,
  currentCube: string,
  y: number,
  x: number
): [string, string, [number, number]] => {
  switch (currentCube + direction) {
    case '1up':
      return ['6', 'right', [x, 0]];
    case '1left':
      return ['5', 'right', [49 - y, 0]];
    case '2up':
      return ['6', 'up', [49, x]];
    case '2right':
      return ['4', 'left', [49 - y, 49]];
    case '2down':
      return ['3', 'left', [x, 49]];
    case '3left':
      return ['5', 'down', [0, y]];
    case '3right':
      return ['2', 'up', [49, y]];
    case '4right':
      return ['2', 'left', [49 - y, 49]];
    case '4down':
      return ['6', 'left', [x, 49]];
    case '5up':
      return ['3', 'right', [x, 0]];
    case '5left':
      return ['1', 'right', [49 - y, 0]];
    case '6left':
      return ['1', 'down', [0, y]];
    case '6right':
      return ['4', 'up', [49, y]];
    case '6down':
      return ['2', 'down', [0, x]];
  }
  throw new Error('No destination cube found');
};

const cubeWrap = (current: [number, number], direction: string): [[number, number], string] => {
  const entry = Object.entries(cubesCoords).find(([, [cubeY, cubeX]]) => {
    const yDiff = current[0] - cubeY;
    const xDiff = current[1] - cubeX;
    return [xDiff, yDiff].every((diff) => diff >= 0 && diff < 50);
  });
  if (!entry) throw new Error('Wrong calc of cube');
  const [cubeNum, currentCubeCoords] = entry;
  const y = current[0] - currentCubeCoords[0];
  const x = current[1] - currentCubeCoords[1];
  const [newCube, newDir, entryCoords] = getDestination(direction, cubeNum, y, x);
  return [[cubesCoords[newCube][0] + entryCoords[0], cubesCoords[newCube][1] + entryCoords[1]], newDir];
};

const getData = (raw: string): [string[][], Order[]] => {
  const [textA, textB] = raw.split('\n\n');
  const map = textA.split('\n').map((str) => [...str]);
  const orders: Order[] = [];
  let current = '';
  for (let i = 0; i < textB.length; i++) {
    const char = textB[i];
    if (char === 'R' || char === 'L') {
      orders.push(Number(current), char);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) orders.push(Number(current));

  return [map, orders];
};

const solveFirst = (raw: string) => {
  const [map, orders] = getData(raw);

  let direction = 'right';
  let position: [number, number] = [0, map[0].indexOf('.')];

  orders.forEach((order) => {
    if (order === 'R' || order === 'L') {
      direction = getDirection(direction, order);
    } else {
      for (let i = 0; i < order; i++) {
        let next = getNextPosition(position, direction);
        let key = map[next[0]]?.[next[1]];
        if (key !== '.' && key !== '#') {
          next = getWrapPosition(position, direction, map);
          key = map[next[0]]?.[next[1]];
        }
        if (key === '.') {
          position = next;
          continue;
        }
        if (key === '#') break;
      }
    }
  });

  return calcPassword(position, direction);
};

const solveSecond = (raw: string) => {
  const [map, orders] = getData(raw);

  let direction = 'right';
  let position: [number, number] = [0, map[0].indexOf('.')];

  orders.forEach((order) => {
    if (order === 'R' || order === 'L') {
      direction = getDirection(direction, order);
    } else {
      for (let i = 0; i < order; i++) {
        let next = getNextPosition(position, direction);
        let nextDir = direction;
        let key = map[next[0]]?.[next[1]];
        if (key !== '.' && key !== '#') {
          const [wrapPosition, wrapDirection] = cubeWrap(position, direction);
          next = wrapPosition;
          nextDir = wrapDirection;
          key = map[next[0]]?.[next[1]];
        }
        if (key === '.') {
          position = next;
          direction = nextDir;
          continue;
        }
        if (key === '#') break;
      }
    }
  });

  return calcPassword(position, direction);
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={22} func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
