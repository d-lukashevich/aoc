import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Position = [number, number];

type Action = (params: { pos: Position; pos2: Position; addAntiNode: (pos: Position) => boolean }) => void;
const constructSolution = (action: Action) => {
  return (raw: string) => {
    const data = parseRows(raw).map((row) => [...row]);
    const rec = data.reduce((acc: Record<string, Position[]>, line, y) => {
      line.forEach((cell, x) => {
        if (cell === '.') return;
        acc[cell] ??= [];
        acc[cell].push([x, y]);
      });
      return acc;
    }, {});

    const antiNodes = new Set<string>();
    const addAntiNode = ([x, y]: Position) => {
      if (data[y]?.[x] === undefined) return false;
      antiNodes.add(`${x},${y}`);
      return true;
    };

    Object.values(rec).forEach((group) => {
      group.forEach((pos) => {
        group.forEach((pos2) => {
          if (pos === pos2) return;
          action({ pos, pos2, addAntiNode });
        });
      });
    });

    return antiNodes.size;
  };
};

const first = constructSolution(({ pos, pos2, addAntiNode }) => {
  const x = pos[0] + (pos[0] - pos2[0]);
  const y = pos[1] + (pos[1] - pos2[1]);
  addAntiNode([x, y]);
});

const second = constructSolution(({ pos, pos2, addAntiNode }) => {
  for (let i = 0; i < Infinity; i++) {
    const x = pos[0] + (pos[0] - pos2[0]) * i;
    const y = pos[1] + (pos[1] - pos2[1]) * i;
    if (!addAntiNode([x, y])) break;
  }
});

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
