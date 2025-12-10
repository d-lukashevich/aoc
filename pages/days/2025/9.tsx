import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Coords = [number, number];
type Bounds = [number, number, number, number];

const getData = (raw: string) => {
  return parseRows(raw).map((str) => str.split(',').map(Number) as Coords);
};

const getBounds = (a: Coords, b: Coords): Bounds => {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
};
const getArea = ([left, top, right, bottom]: Bounds) => {
  return (right - left + 1) * (bottom - top + 1);
};

const getRectangles = (rows: Coords[]) => {
  const pairs: { bounds: Bounds; area: number }[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    for (let j = i + 1; j < rows.length; j++) {
      const bounds = getBounds(a, rows[j]);
      pairs.push({ bounds, area: getArea(bounds) });
    }
  }
  return pairs.sort((p1, p2) => p2.area - p1.area);
};

const intersects = ([aLeft, aTop, aRight, aBottom]: Bounds, [bLeft, bTop, bRight, bBottom]: Bounds) => {
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
};

const first = (raw: string) => {
  const rows = getData(raw);
  return getRectangles(rows)[0]?.area;
};

const second = (raw: string) => {
  const rows = getData(raw);
  const rectangles = getRectangles(rows);
  const borders = rows.map((coords, i) => getBounds(coords, rows.at(i - 1)!));
  for (const { bounds, area } of rectangles) {
    const hasIntersection = borders.some((border) => intersects(bounds, border));
    if (!hasIntersection) return area;
  }
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
