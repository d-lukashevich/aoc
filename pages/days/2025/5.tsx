import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const ranges: [number, number][] = [];
  const ids: number[] = [];
  let isIds = false;
  rows.forEach((row) => {
    if (!row) {
      isIds = true;
      return;
    }
    if (isIds) {
      ids.push(Number(row));
    } else {
      ranges.push(row.split('-').map(Number) as [number, number]);
    }
  });
  return { ranges, ids };
};

const first = (raw: string) => {
  const { ranges, ids } = getData(raw);

  return ids.reduce((sum, id) => {
    for (let i = 0; i < ranges.length; i++) {
      const [start, end] = ranges[i];
      if (id >= start && id <= end) return sum + 1;
    }
    return sum;
  }, 0);
};

const second = (raw: string) => {
  const { ranges } = getData(raw);
  const finalRanges: [number, number][] = [];

  ranges.forEach((range) => {
    let tempRanges: [number, number][] = [range];
    finalRanges.forEach((fRange) => {
      tempRanges = tempRanges.flatMap((tRange) => {
        if (tRange[1] < fRange[0] || tRange[0] > fRange[1]) return [tRange];
        if (tRange[0] >= fRange[0] && tRange[1] <= fRange[1]) return [];
        if (tRange[0] < fRange[0] && tRange[1] > fRange[1])
          return [
            [tRange[0], fRange[0] - 1],
            [fRange[1] + 1, tRange[1]],
          ];
        if (tRange[0] < fRange[0]) return [[tRange[0], fRange[0] - 1]];
        if (tRange[1] > fRange[1]) return [[fRange[1] + 1, tRange[1]]];
        return [];
      });
    });
    finalRanges.push(...tempRanges);
  });

  return finalRanges.reduce((sum, range) => sum + range[1] - range[0] + 1, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
