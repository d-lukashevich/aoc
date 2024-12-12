import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Fence = [boolean, boolean, boolean, boolean];
type Region = [number, number, number];

const getData = (raw: string) => {
  const data = parseRows(raw).map((row) => row.split(''));
  const seen = new Set<string>();

  const giveNeighbors = (x: number, y: number) => [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ];

  const getFences = (x: number, y: number, letter: unknown): Fence => {
    const diffLetter = data[y]?.[x];
    if (diffLetter !== letter) return [false, false, false, false];
    return giveNeighbors(x, y).map(([nx, ny]) => data[ny]?.[nx] !== diffLetter) as Fence;
  };

  const calcRegion = (x: number, y: number): [number, number, number] => {
    const letter = data[y][x];
    let perimeter = 0;
    let area = 1;
    let sides = 0;
    seen.add(`${x},${y}`);

    const fences = getFences(x, y, letter);
    const [, rightFence, , leftFence] = getFences(x, y - 1, letter);
    const [topFence, , bottomFence] = getFences(x - 1, y, letter);
    const comparisonFences = [topFence, rightFence, bottomFence, leftFence];
    fences.forEach((fence, i) => {
      if (fence && !comparisonFences[i]) sides++;
    });

    giveNeighbors(x, y).forEach(([nx, ny]) => {
      const val = data[ny]?.[nx];
      if (val !== letter) {
        perimeter++;
        return;
      }
      if (data[ny][nx] === letter && !seen.has(`${nx},${ny}`)) {
        const [a, p, s] = calcRegion(nx, ny);
        perimeter += p;
        area += a;
        sides += s;
      }
    });

    return [area, perimeter, sides];
  };

  const regions: Region[] = [];
  data.forEach((row, x) => {
    row.forEach((_, y) => seen.has(`${x},${y}`) || regions.push(calcRegion(x, y)));
  });

  return regions;
};

const first = (raw: string) => {
  return getData(raw).reduce((acc, [area, perimeter]) => acc + perimeter * area, 0);
};
const second = (raw: string) => {
  return getData(raw).reduce((acc, [area, , sides]) => acc + sides * area, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
