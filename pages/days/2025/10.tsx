import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows, withCache } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw).map((row) => row.split(' '));

  return rows.map((row) => {
    const diagramRaw = row.splice(0, 1)[0]!;
    const diagram = [...diagramRaw].slice(1, -1).map((char) => (char === '#' ? 1 : 0));

    const counters = [...row.splice(-1, 1)[0]].slice(1, -1).join('').split(',').map(Number);

    const buttons = row.map((row) => {
      return [...row].slice(1, -1).join('').split(',').map(Number);
    });

    return { diagram, counters, buttons };
  });
};

const encode = (diagram: number[]) => diagram.join(',');
const decode = (state: string) => state.split(',').map(Number);

const first = (raw: string) => {
  const rows = getData(raw);

  const pressButton = (stateStr: string, button: number[]) => {
    const state = decode(stateStr);
    button.forEach((pos) => {
      state[pos] = state[pos] === 1 ? 0 : 1;
    });
    return encode(state);
  };

  const solveRow = ({ buttons, diagram }: ReturnType<typeof getData>[number]) => {
    const final = encode(diagram);

    const seen = new Set<string>();

    const queue = [{ state: encode(new Array(diagram.length).fill(0)), depth: 0 }];
    let pointer = 0;
    while (queue.length) {
      const { state, depth } = queue[pointer];
      delete queue[pointer];
      pointer++;

      if (state === final) return depth;
      if (seen.has(state)) continue;
      seen.add(state);
      buttons.forEach((button) => {
        const newState = pressButton(state, button);
        queue.push({ state: newState, depth: depth + 1 });
      });
    }
    throw new Error();
  };

  return rows.map(solveRow).reduce((acc, num) => acc + num);
};

const second = (raw: string) => {
  const rows = getData(raw);

  const pressButton = ([...counters]: number[], button: number[]) => {
    button.forEach((pos) => counters[pos]++);
    return counters;
  };

  const getPatterns = (counters: number[], buttons: number[][]) => {
    const patternsMap = new Map<string, [number[], number]>();
    const calcPatterns = (pattern: number[], bI: number, presses: number) => {
      const button = buttons[bI];
      if (!button) {
        if (counters.map((c, i) => c - pattern[i]).every((c) => c % 2 === 0)) {
          const key = encode(pattern);
          patternsMap.set(key, [pattern, Math.min(patternsMap.get(key)?.[1] ?? Infinity, presses)]);
        }
        return;
      }
      calcPatterns(pattern, bI + 1, presses);
      calcPatterns(pressButton(pattern, button), bI + 1, presses + 1);
    };
    calcPatterns(new Array(counters.length).fill(0), 0, 0);
    return [...patternsMap.values()];
  };

  const solveRow = ({ buttons, counters }: ReturnType<typeof getData>[number]) => {
    const solve = withCache((counters: number[]): number => {
      if (counters.some((c) => c < 0)) return Infinity;
      if (counters.every((c) => c === 0)) return 0;
      const res = getPatterns(counters, buttons).map(([pattern, patternDepth]) => {
        const state = counters.map((c, i) => c - pattern[i]);
        return solve(state.map((c) => c / 2)) * 2 + patternDepth;
      });
      return Math.min(...res);
    });
    return solve(counters);
  };

  return rows.map((row) => solveRow(row)).reduce((acc, num) => acc + num);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
