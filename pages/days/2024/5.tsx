import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const data = parseRows(raw);
  const rules: [number, number][] = [];
  const updates: number[][] = [];

  data.forEach((row) => {
    if (row.includes(',')) {
      const upd = row.split(',').map(Number);
      updates.push(upd);
    }
    if (row.includes('|')) {
      const [a, b] = row.split('|').map(Number);
      rules.push([a, b]);
    }
  });

  return { rules, updates };
};
const first = (raw: string) => {
  const { rules, updates } = getData(raw);
  const rulesRec = rules.reduce((acc: Record<number, number[]>, [a, b]) => {
    acc[a] ??= [];
    acc[a].push(b);
    return acc;
  }, {});

  const validUpdates = updates.filter((upd) => {
    const seen = new Set<number>();
    for (let i = 0; i < upd.length; i++) {
      const num = upd[i];
      if (rulesRec[num]?.some((next) => seen.has(next))) return false;
      seen.add(num);
    }
    return upd.length === seen.size;
  });

  return validUpdates.reduce((acc, arr) => {
    return acc + arr[Math.floor(arr.length / 2)];
  }, 0);
};

const second = (raw: string) => {
  const { rules, updates } = getData(raw);
  const rulesRec = rules.reduce((acc: Record<number, number[]>, [a, b]) => {
    acc[a] ??= [];
    acc[a].push(b);
    acc[a].sort((a, b) => a - b);
    return acc;
  }, {});

  const invalidUpdates = updates.filter((upd) => {
    const seen = new Set<number>();
    for (let i = 0; i < upd.length; i++) {
      const num = upd[i];
      if (rulesRec[num]?.some((next) => seen.has(next))) return true;
      seen.add(num);
    }
    return false;
  });

  const fix = (arr: number[]): number[] => {
    const seen = new Map<number, number>();
    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      const rules = rulesRec[num] || [];
      const miss = rules.find((next) => seen.has(next));
      if (miss !== undefined) {
        const missPos = seen.get(miss)!;
        const newArr = arr.toSpliced(missPos, 0, num).toSpliced(i + 1, 1);
        return fix(newArr);
      }
      seen.set(num, i);
    }
    return arr;
  };

  return invalidUpdates
    .map((arr) => fix(arr))
    .reduce((acc, arr) => {
      return acc + arr[Math.floor(arr.length / 2)];
    }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
