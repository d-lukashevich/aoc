import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Coord = [number, number];

const encode = ([i, j]: Coord) => `${i},${j}`;

const getHeight = (str: string) => {
  if (str === 'S') return 97;
  if (str === 'E') return 122;
  return str.charCodeAt(0);
};

const getData = (raw: string): string[][] => {
  const text = '["' + raw.replaceAll('\n', '","') + '"]';
  return JSON.parse(text).map((str: string) => [...str]);
};

const getCandidates = (current: Coord | undefined): Coord[] => {
  if (!current) return [];
  const [i, j] = current;
  return [
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
    [i, j - 1],
  ];
};

const solveFirst = (raw: string) => {
  const data = getData(raw);

  const getValue = ([i, j]: Coord): string | undefined => data[i]?.[j];

  const hash: Record<string, number> = {};
  let queue: Coord[] = [[20, 0]];

  while (queue.length && !hash['20,120']) {
    const current = queue.shift();
    if (!current) break;
    const currentPath = hash[encode(current)] || 0;
    const currentHeight = getHeight(getValue(current) as string);
    const candidates = getCandidates(current);
    candidates.forEach((candidate) => {
      const value = getValue(candidate);
      if (value && getHeight(value) - 1 <= currentHeight) {
        const candidateStr = encode(candidate);
        if (candidateStr in hash) return;
        hash[candidateStr] = currentPath + 1;
        queue.push(candidate);
      }
    });
  }

  return hash['20,120'];
};

const solveSecond = (raw: string) => {
  const data = getData(raw);

  const getValue = ([i, j]: Coord): string | undefined => data[i]?.[j];

  const hash: Record<string, number> = {};
  let queue: Coord[] = [[20, 120]];

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    const currentPath = hash[encode(current)] || 0;
    const currentHeight = getHeight(getValue(current) as string);
    const candidates = getCandidates(current);
    candidates.forEach((candidate) => {
      const value = getValue(candidate);
      if (value && getHeight(value) >= currentHeight - 1) {
        const candidateStr = encode(candidate);
        if (candidateStr in hash) return;
        hash[candidateStr] = currentPath + 1;
        queue.push(candidate);
      }
    });
  }

  return Object.entries(hash).reduce((acc, [str, height]) => {
    if (height > acc) return acc;
    const [i, j] = str.split(',').map((item) => Number(item));
    if (i === 0 || j === 0 || i === data.length - 1 || j === data[0].length - 1) {
      if (getValue([i, j]) === 'a') return Math.min(acc, height);
    }
    return acc;
  }, Infinity);
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
