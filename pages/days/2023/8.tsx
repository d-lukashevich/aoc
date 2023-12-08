import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Turn = 'L' | 'R';
type Map = Record<string, { L: string; R: string }>;

const reg = /(.+) = \((.+), (.+)\)/;

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const turns = [...rows[0]] as Turn[];
  const map: Map = {};
  for (let i = 2; i < rows.length; i++) {
    const [, postion, L, R] = reg.exec(rows[i])!;
    map[postion] = { L, R };
  }
  return { turns, map };
};

const getSteps = (turns: Turn[], map: Map, starts: string[], stop: RegExp) => {
  return starts.map((str) => {
    let i = 0;
    while (!stop.test(str)) {
      const turn = turns[i % turns.length];
      str = map[str][turn];
      i++;
    }
    return i;
  });
};

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (...nums: number[]) => nums.reduce((a, b) => (a * b) / gcd(a, b));

const first = (raw: string) => {
  const { turns, map } = getData(raw);
  return getSteps(turns, map, ['AAA'], /ZZZ/)[0];
};

const second = (raw: string) => {
  const { turns, map } = getData(raw);
  const starts = Object.keys(map).filter((str) => str.at(-1) === 'A');
  return lcm(...getSteps(turns, map, starts, /..Z/));
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
