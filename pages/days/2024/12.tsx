import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Fence = [boolean, boolean, boolean, boolean];
type Region = { area: number; perimeter: number; sides: number };

const getData = (raw: string) => {
  const data = parseRows(raw).map((row) => row.split(''));
  const seen = new Set<string>();

  const getNeighbors = (x: number, y: number) => [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ];

  const getFences = (x: number, y: number, letter: unknown): Fence => {
    const diffLetter = data[y]?.[x];
    if (diffLetter !== letter) return [false, false, false, false];
    return getNeighbors(x, y).map(([nx, ny]) => data[ny]?.[nx] !== diffLetter) as Fence;
  };

  const calcSides = (x: number, y: number) => {
    const fences = getFences(x, y, data[y][x]);
    const [, rightFence, , leftFence] = getFences(x, y - 1, data[y][x]);
    const [topFence, , bottomFence] = getFences(x - 1, y, data[y][x]);
    const comparisonFences = [topFence, rightFence, bottomFence, leftFence];
    return fences.reduce((acc, fence, i) => acc + +(fence && !comparisonFences[i]), 0);
  };

  const calcRegion = (x: number, y: number): Region => {
    const letter = data[y][x];
    seen.add(`${x},${y}`);

    const region = { area: 1, perimeter: 0, sides: calcSides(x, y) };
    return getNeighbors(x, y).reduce((acc, [nx, ny]) => {
      const val = data[ny]?.[nx];
      if (val !== letter) acc.perimeter++;
      if (val === letter && !seen.has(`${nx},${ny}`)) {
        const { area, perimeter, sides } = calcRegion(nx, ny);
        acc.perimeter += perimeter;
        acc.area += area;
        acc.sides += sides;
      }
      return acc;
    }, region);
  };

  const regions: Region[] = [];
  data.forEach((row, x) => {
    row.forEach((_, y) => seen.has(`${x},${y}`) || regions.push(calcRegion(x, y)));
  });

  return regions;
};

const first = (raw: string) => {
  return getData(raw).reduce((acc, { area, perimeter }) => acc + perimeter * area, 0);
};
const second = (raw: string) => {
  return getData(raw).reduce((acc, { area, sides }) => acc + sides * area, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
