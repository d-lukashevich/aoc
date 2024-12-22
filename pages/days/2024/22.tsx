import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map(BigInt);

export const withCache = <Args extends unknown[], Result extends unknown>(fn: (...args: Args) => Result) => {
  const cache: Record<string, Result> = {};
  return (...args: Args) => {
    const key = args.map((num) => num?.toString()).join('::');
    if (key in cache) return cache[key];
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

const mix = (a: bigint, b: bigint) => a ^ b;
const prune = (num: bigint) => num % 16777216n;
const i1 = (num: bigint) => prune(mix(num, num * 64n));
const i2 = (num: bigint) => prune(mix(num, BigInt(Math.floor(Number(num / 32n)))));
const i3 = (num: bigint) => prune(mix(num, num * 2048n));
const evolveNumber = (prev: bigint) => i3(i2(i1(prev)));

const evolveDeep = (current: bigint, deep: number): bigint => {
  if (deep === 0) return current;
  return evolveNumber(evolveDeep(current, deep - 1));
};
const evolveDeepCache = withCache((current: bigint, deep: number): bigint => {
  if (deep === 0) return current;
  return evolveNumber(evolveDeepCache(current, deep - 1));
});

const first = (raw: string) => {
  return Number(getData(raw).reduce((acc, num) => evolveDeep(num, 2000) + acc, 0n));
};

const getPrice = (num: bigint) => Number(num.toString().at(-1));

const second = (raw: string) => {
  const data = getData(raw);

  const hash = new Map<string, number>();

  data.forEach((num) => {
    const seenCombos = new Set<string>();

    const prices: number[] = [];
    const diffs: number[] = [];

    for (let i = 0; i <= 2000; i++) {
      const price = getPrice(evolveDeepCache(num, i));
      prices.push(price);
      diffs.push(prices[i] - prices[i - 1] || 0);
      if (i < 4) continue;
      const key = diffs.slice(i - 3, i + 1).join(',');
      if (!seenCombos.has(key)) {
        seenCombos.add(key);
        hash.set(key, (hash.get(key) ?? 0) + price);
      }
    }
  });

  return Math.max(...hash.values());
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
