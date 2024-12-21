import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

type Pos = [number, number];
type Pad = (string | null)[][];
type PadMap = Map<string | null, Pos>;

const numPad: Pad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [null, '0', 'A'],
];
const dirPad: Pad = [
  [null, '^', 'A'],
  ['<', 'v', '>'],
];
const getMap = (pad: Pad) => {
  const rec = new Map<string | null, Pos>();
  pad.forEach((row, y) => {
    row.forEach((val, x) => rec.set(val, [x, y]));
  });
  return rec;
};
const numMap: PadMap = getMap(numPad);
const dirMap: PadMap = getMap(dirPad);

const pairs = {
  dir: [dirPad, dirMap],
  num: [numPad, numMap],
} as const;
type Pair = 'dir' | 'num';

const getAllCombos = (position: Pos, target: string, pair: Pair) => {
  const [pad, padMap] = pairs[pair];
  const __ = padMap.get(target);
  if (!__) throw new Error(target);
  const [tx, ty] = padMap.get(target)!;
  const findCombos = ([x, y]: Pos): string[] | null => {
    if (pad[y][x] === null) return null;
    if (x === tx && y === ty) return ['A'];
    const combos: string[] = [];
    if (x < tx) findCombos([x + 1, y])?.forEach((combo) => combos.push(`>${combo}`));
    if (x > tx) findCombos([x - 1, y])?.forEach((combo) => combos.push(`<${combo}`));
    if (y < ty) findCombos([x, y + 1])?.forEach((combo) => combos.push(`v${combo}`));
    if (y > ty) findCombos([x, y - 1])?.forEach((combo) => combos.push(`^${combo}`));
    return combos;
  };
  return findCombos(position);
};

const sumLens = (combo: string, deep: number, pair: Pair) => {
  let sum = 0;
  const [, padMap] = pairs[pair];
  let curr = padMap.get('A')!;
  for (let i = 0; i < combo.length; i++) {
    const char = combo[i];
    sum += findLen(deep - 1, char, pair, curr);
    curr = padMap.get(char)!;
  }
  return sum;
};

const findLen = withCache((deep: number, target: string, pair: Pair, pos: Pos): number => {
  if (deep === 0) return 1;
  const combos = getAllCombos(pos, target, pair);
  if (!combos) return 0;
  return Math.min(...combos.map((combo) => sumLens(combo, deep, 'dir')));
});

const makeSolution = (dirs: number) => {
  return (raw: string) => {
    return parseRows(raw).reduce((acc, code) => {
      return Number(code.slice(0, -1)) * sumLens(code, dirs + 2, 'num') + acc;
    }, 0);
  };
};

const first = makeSolution(2);
const second = makeSolution(25);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
