import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

const reg = /Sensor at x=(-*\d+), y=(-*\d+): closest beacon is at x=(-*\d+), y=(-*\d+)/;
const getData = (raw: string): [[number, number], [number, number]][] => {
  const text = '"' + raw.replaceAll('\n', '", "') + '"';
  return JSON.parse(`[${text}]`).map((str: string) => {
    const match = str.match(reg) as string[];
    const nums = match.splice(1, 4).map(Number);
    return [
      [nums[0], nums[1]],
      [nums[2], nums[3]],
    ];
  });
};

const getCoverage = (rowNum: number, data: [[number, number], [number, number]][]) => {
  const lineCoverages: [number, number][] = [];
  data.forEach(([S, B]) => {
    const len = Math.abs(B[0] - S[0]) + Math.abs(B[1] - S[1]);
    const wing = len - Math.abs(rowNum - S[1]);
    if (wing >= 0) {
      lineCoverages.push([S[0] - wing, S[0] + wing]);
    }
  });

  const sorted = [...lineCoverages].sort((a, b) => a[0] - b[0]);
  return sorted.reduce((acc: [number, number][], line, i) => {
    if (i === 0) acc.push([...line]);
    const last = acc.at(-1);
    if (!last) return acc;
    if (line[0] - last[1] <= 1) {
      last[1] = Math.max(last[1], line[1]);
    } else {
      acc.push([...line]);
    }
    return acc;
  }, []);
};

const solveFirst = (raw: string) => {
  const row = 2000000;
  const data = getData(raw);
  const coverage = getCoverage(row, data);
  return coverage.reduce((acc, item) => {
    return acc + item[1] - item[0];
  }, 0);
};

const solveSecond = (raw: string) => {
  const data = getData(raw);
  let candidate;
  for (let i = 0; i <= 4000000; i++) {
    const coverage = getCoverage(i, data);
    if (coverage.length > 1) {
      candidate = [coverage[0][1] + 1, i];
      break;
    }
  }
  if (!candidate) return 'Not found';
  return candidate[0] * 4000000 + candidate[1];
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveFirst} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
