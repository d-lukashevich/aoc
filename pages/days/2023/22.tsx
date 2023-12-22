import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Position = [number, number, number];
type Brick = [Position, Position];

const isHorizontalOverlap = (a: Brick, b: Brick) => {
  if (a[0][0] > b[1][0]) return false;
  if (a[1][0] < b[0][0]) return false;
  if (a[0][1] > b[1][1]) return false;
  return a[1][1] >= b[0][1];
};

const getData = (raw: string) => {
  const data = parseRows(raw)
    .map((row) => row.split('~').map((section) => section.split(',').map(Number)))
    .sort((a, b) => a[0][2] - b[0][2]) as Brick[];

  const supports: number[][] = new Array(data.length).fill(0).map(() => []);
  const supportedBy: number[][] = new Array(data.length).fill(0).map(() => []);

  data.forEach((brick, i) => {
    let stopHeight = 0;

    const overlaps: [number, number][] = [];

    for (let j = i - 1; j >= 0; j--) {
      const bBrick = data[j];
      if (isHorizontalOverlap(brick, bBrick)) {
        overlaps.push([j, bBrick[1][2]]);
      }
    }
    overlaps.sort((a, b) => b[1] - a[1]);
    overlaps.forEach(([j, height]) => {
      if (height >= stopHeight) {
        supports[j].push(i);
        supportedBy[i].push(j);
        stopHeight = height;
      }
    });

    const height = brick[1][2] - brick[0][2];
    brick[0][2] = stopHeight + 1;
    brick[1][2] = brick[0][2] + height;
  });

  return { data, supports, supportedBy };
};

const first = (raw: string) => {
  const { data, supports, supportedBy } = getData(raw);

  const destroyable = data.filter((_, i) => {
    return supports[i].every((j) => {
      return supportedBy[j].length > 1;
    });
  });
  return destroyable.length;
};

const second = (raw: string) => {
  const { data, supports, supportedBy } = getData(raw);

  const destroy = (destroyIndex: number) => {
    const queue = [...supports[destroyIndex]];
    const fallen = new Set([destroyIndex]);

    for (let pointer = 0; pointer < queue.length; pointer++) {
      const i = queue[pointer];
      const shouldFall = supportedBy[i].every((j) => fallen.has(j));
      if (shouldFall) {
        queue.push(...supports[i]);
        fallen.add(i);
      }
    }
    return fallen.size - 1;
  };

  return data.map((_, i) => destroy(i)).reduce((a, b) => a + b, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
