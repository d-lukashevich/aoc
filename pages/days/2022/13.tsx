import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Value = number | Value[];

const getData = (raw: string): [Value, Value][] => {
  const text = '[' + raw.replaceAll('\n\n', '],[').replaceAll('\n', ',') + ']';
  return JSON.parse(`[${text}]`);
};

const compare = (a: Value, b: Value): number => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  const subA = Array.isArray(a) ? a : [a];
  const subB = Array.isArray(b) ? b : [b];
  for (let i = 0; i < Math.max(subA.length, subB.length); i++) {
    if (subA[i] === undefined) return -1;
    if (subB[i] === undefined) return 1;
    const res = compare(subA[i], subB[i]);
    if (res !== 0) return res;
  }
  return 0;
};

const solveFirst = (raw: string) => {
  const data = getData(raw);
  return data.reduce((acc, [a, b], i) => {
    return compare(a, b) < 0 ? i + 1 + acc : acc;
  }, 0);
};

const solveSecond = (raw: string) => {
  const data = getData(raw);

  const allPack = data.reduce((acc: Value[], packs) => {
    acc.push(...packs);
    return acc;
  }, []);
  const first = [[2]];
  const second = [[6]];
  const list = [...allPack, first, second].sort(compare);
  return list.reduce((acc: number, pack, i) => {
    return (pack === first || pack === second ? i + 1 : 1) * acc;
  }, 1);
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
