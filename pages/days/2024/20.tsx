import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

type Pos = [number, number];

const getAround = ([x, y]: Pos): Pos[] => {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
};

const getData = (raw: string) => {
  let start: Pos;
  let end: Pos;
  const data = parseRows(raw).map((row, y) => {
    return [...row].map((cell, x) => {
      if (cell === 'S') start = [x, y];
      if (cell === 'E') end = [x, y];
      return cell === '#' ? '#' : '.';
    });
  });
  // @ts-ignore
  if (!start || !end) throw new Error('Invalid input');
  return { data, start, end };
};

const countCheats = (originalDeep: number) => {
  return (raw: string) => {
    const { start, end, data } = getData(raw);

    const queue = [{ pos: end, steps: 0 }];
    const seen = new Map<string, number>();
    seen.set(end.join(','), 0);

    for (let i = 0; i < queue.length; i++) {
      const { pos: curr, steps } = queue[i]!;
      if (curr[0] === start[0] && curr[1] === start[1]) continue;
      getAround(curr).forEach(([x, y]) => {
        const key = [x, y].join(',');
        if (data[y][x] !== '.') return;
        if (seen.has(key)) return;
        seen.set(key, steps + 1);
        queue.push({ pos: [x, y], steps: steps + 1 });
      });
    }

    const cheats = new Map<string, number>();
    data.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === '#') return;

        const enterKey = [x, y].join(',');
        const enterScore = seen.get(enterKey)!;

        const checkDeep = withCache(([x, y]: Pos, deep: number = originalDeep) => {
          if (data[y]?.[x] === '.' && deep !== originalDeep) {
            const key = [x, y].join(',');
            const exitScore = seen.get(key)!;
            const score = exitScore - enterScore - originalDeep + deep;
            if (score > 0) {
              const last = cheats.get(`${enterKey}::${key}`) ?? 0;
              cheats.set(`${enterKey}::${key}`, Math.max(last, score));
            }
          }
          if (deep === 0) return;
          getAround([x, y]).forEach(([x, y]) => {
            const val = data[y]?.[x];
            if (val !== undefined) return checkDeep([x, y], deep - 1);
          });
        });

        checkDeep([x, y]);
      });
    });

    return [...cheats.values()].reduce((acc, score) => acc + +(score >= 100), 0);
  };
};

const first = countCheats(2);
const second = countCheats(20); // quite slow - takes more than 2 minutes to run

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
