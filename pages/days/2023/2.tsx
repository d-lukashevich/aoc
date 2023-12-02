import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const gameReg = /Game (\d+): (.+)$/;
const setReg = /(\d+) (blue|red|green)/g;

const parse = (raw: string) => {
  const rows = parseRows(raw);
  return rows.map((row) => {
    const [, srtId, str] = row.match(gameReg)!;
    const sets = str.split(';').map((setStr) => {
      const result = [...setStr.matchAll(setReg)!];
      return result.reduce((acc: Record<string, number>, item) => {
        const [, num, color] = item;
        acc[color] = Number(num);
        return acc;
      }, {});
    });
    return {
      id: Number(srtId),
      sets,
    };
  });
};

const max: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const first = (raw: string) => {
  return parse(raw).reduce((acc, { id, sets }) => {
    const isPossible = sets.every((set) => {
      return Object.keys(set).every((color) => {
        return set[color] <= max[color];
      });
    });
    if (isPossible) acc += id;
    return acc;
  }, 0);
};

const second = (raw: string) => {
  const data = parse(raw);
  const max = data.map(({ sets }) => {
    return sets.reduce(
      (acc, { red, green, blue }) => {
        if (red > acc.red) acc.red = red;
        if (green > acc.green) acc.green = green;
        if (blue > acc.blue) acc.blue = blue;
        return acc;
      },
      {
        red: 0,
        green: 0,
        blue: 0,
      }
    );
  });
  return max.reduce((acc, { red, green, blue }) => acc + red * green * blue, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
