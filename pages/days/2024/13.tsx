import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Slot = {
  a: [number, number];
  b: [number, number];
  target: [number, number];
};

const buttonReg = /Button .: X\+(\d+), Y\+(\d+)/;
const prizeReg = /Prize: X=(\d+), Y=(\d+)/;
const getNums = (regExp: RegExp, str: string, addon = 0): [number, number] => {
  const [, x, y] = str.match(regExp)!;
  return [Number(x) + addon, Number(y) + addon];
};

const solveSlot = ({ a, b, target }: Slot) => {
  // solve system of equations
  // t0 = a0 * i + b0 * j
  // t1 = a1 * i + b1 * j
  // multiply by a1/a0, subtract both sides, simplify to:
  const i = (target[0] * b[1] - target[1] * b[0]) / (b[1] * a[0] - b[0] * a[1]);
  const j = (target[0] * a[1] - target[1] * a[0]) / (a[1] * b[0] - b[1] * a[0]);
  if (i % 1 > 0 || j % 1 > 0) return 0; // remove non integer solutions
  return 3 * i + j;
};

const createSolution = (addon = 0) => {
  return (raw: string) => {
    const slots: Slot[] = [];
    const data = parseRows(raw);
    for (let i = 0; i < data.length; i += 4) {
      slots.push({
        a: getNums(buttonReg, data[i]),
        b: getNums(buttonReg, data[i + 1]),
        target: getNums(prizeReg, data[i + 2], addon),
      });
    }

    return slots.reduce((acc, slot) => acc + solveSlot(slot), 0);
  };
};

const first = createSolution();
const second = createSolution(10000000000000);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
