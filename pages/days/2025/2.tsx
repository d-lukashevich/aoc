import { PuzzleRenderer } from '@units/PuzzleRenderer';

const getData = (raw: string) => {
  return raw.split(',').map((nums) => nums.split('-').map((str) => Number(str))) as [number, number][];
};

const first = (raw: string) => {
  const pairs = getData(raw);
  const ids: number[] = [];
  pairs.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      const strId = String(i);
      const mid = strId.length / 2;
      if (!Number.isInteger(mid)) continue;
      if (strId.slice(0, mid) === strId.slice(mid)) ids.push(i);
    }
  });

  return ids.reduce((sum, id) => sum + id);
};

const second = (raw: string) => {
  const pairs = getData(raw);
  const ids: number[] = [];
  pairs.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      const strId = String(i);
      const mid = strId.length / 2;
      for (let len = 1; len <= mid; len++) {
        const chunks = new Set<string>();
        for (let pos = 0; pos < strId.length; pos += len) {
          chunks.add(strId.slice(pos, pos + len));
          if (chunks.size > 1) break;
        }
        if (chunks.size === 1) {
          ids.push(i);
          break;
        }
      }
    }
  });

  return ids.reduce((sum, id) => sum + id);
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
