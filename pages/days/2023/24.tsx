import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Position = [number, number, number];
type Hail = [Position, Position];

const getIntersection = ([aPos, [adx, ady]]: Hail, [bPos, [bdx, bdy]]: Hail) => {
  const denom = bdy * adx - bdx * ady;
  // if (bx0 - ax0) * ady == (by0 - ay0) * adx:
  if (denom === 0) {
    if ((bPos[0] - aPos[0]) * ady !== (bPos[1] - aPos[1]) * adx) return null;
    return undefined;
  }
  const t = (bdx * (aPos[1] - bPos[1]) + bdy * (bPos[0] - aPos[0])) / denom;
  return [aPos[0] + adx * t, aPos[1] + ady * t] as [number, number];
};

const getData = (raw: string) => {
  const data: Hail[] = parseRows(raw).map((row) => {
    const [hailStr, diffStr] = row.split(' @ ');
    const position = hailStr.split(',').map(Number) as Position;
    const diff = diffStr.split(',').map(Number) as Position;
    return [position, diff];
  });
  return data;
};

const isInFuture = (a: Hail, b: Hail, intersection: [number, number]) => {
  return [a, b].every(([[x, y], [xD, yD]]) => {
    if (Math.abs(intersection[0] - x) < Math.abs(intersection[0] - (x + xD))) return false;
    return Math.abs(intersection[1] - y) > Math.abs(intersection[1] - (y + yD));
  });
};

const first = (raw: string) => {
  const data = getData(raw);
  const boundaries = [200000000000000, 400000000000000];

  let counter = 0;
  for (let i = 0; i < data.length; i++) {
    const hailA = data[i];
    for (let j = i + 1; j < data.length; j++) {
      const hailB = data[j];
      const intersection = getIntersection(hailA, hailB);
      if (!intersection) continue;

      if (
        intersection.every((val) => val >= boundaries[0] && val <= boundaries[1]) &&
        isInFuture(hailA, hailB, intersection)
      ) {
        counter++;
      }
    }
  }
  return counter;
};

const second = (raw: string) => getData(raw);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
