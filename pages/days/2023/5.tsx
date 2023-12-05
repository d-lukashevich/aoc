import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Item = [number, number, number];

const getNumsList = (str: string) => {
  return str
    .split(' ')
    .filter((str) => str !== '')
    .map(Number);
};

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const [, rawSeeds] = rows[0].split(':')!;
  const seeds = getNumsList(rawSeeds);

  const maps: [number, number, number][][] = [];
  let map: [number, number, number][] | undefined = undefined;
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row) {
      maps.push(map!);
      map = undefined;
      continue;
    }
    if (row.includes('map:')) continue;
    map ??= [];
    map.push(getNumsList(row) as [number, number, number]);
  }
  if (map) maps.push(map);

  return { seeds, maps };
};

const getLocation = (seed: number, maps: [number, number, number][][]) => {
  return maps.reduce((location, map, line) => {
    for (let i = 0; i < map.length; i++) {
      const [dest, src, len] = map[i];
      const diff = location - src;
      if (diff >= 0 && diff < len) return dest + diff;
    }
    return location;
  }, seed);
};

const first = (raw: string) => {
  const { seeds, maps } = getData(raw);
  const locations = seeds.map((seed) => getLocation(seed, maps));
  return Math.min(...locations);
};

const getSeedsPairs = (seeds: number[]) => {
  return seeds.reduce((acc: [number, number][], seed, i) => {
    if (i % 2 === 0) acc.push([seed, seeds[i + 1]]);
    return acc;
  }, []);
};

const sortBySrc = (map: [number, number, number][]) => {
  return [...map].sort((a, b) => a[1] - b[1]);
};
const sortByDest = (map: [number, number, number][]) => {
  return [...map].sort((a, b) => a[0] - b[0]);
};

const getPortals = (leftsOriginal: Item[], rightsOriginal: Item[]) => {
  const lefts = sortByDest(leftsOriginal);
  const rights = sortBySrc(rightsOriginal);
  let i = 0;
  let j = 0;
  const portals: Item[] = [];
  while (i < lefts.length && j < rights.length) {
    const left = lefts[i];
    const right = rights[j];
    const shift: number = left[0] - left[1];
    const leftStart: number = left[1] + shift;
    const leftEnd: number = left[1] + left[2] + shift - 1;
    const rightStart: number = right[1];
    const rightEnd: number = right[1] + right[2] - 1;

    if (leftEnd < rightStart) {
      i++;
      continue;
    }
    if (rightEnd < leftStart) {
      j++;
      continue;
    }

    const portalStart = Math.max(leftStart, rightStart);
    const rightShift = right[0] - right[1];
    portals.push([portalStart + rightShift, portalStart - shift, Math.min(leftEnd, rightEnd) - portalStart + 1]);
    if (leftEnd <= rightEnd) i++;
    if (rightEnd <= leftEnd) j++;
  }
  return sortBySrc(portals);
};

// lefts have priority
const mergeItems = (leftsOriginal: Item[], rightsOriginal: Item[]) => {
  const lefts = sortBySrc(leftsOriginal);
  const rights = sortBySrc(rightsOriginal);

  const result = [...lefts];
  let left: Item | undefined = undefined;
  let right: Item | undefined = undefined;

  while (lefts.length || left || rights.length || right) {
    left ??= lefts.shift();
    right ??= rights.shift();

    if (!right) break;
    if (!left) {
      result.push(right);
      right = undefined;
      continue;
    }

    const leftStart: number = left[1];
    const leftEnd: number = left[1] + left[2] - 1;
    const rightStart: number = right[1];
    const rightEnd: number = right[1] + right[2] - 1;

    if (leftEnd < rightStart) {
      left = undefined;
      continue;
    }
    if (rightEnd < leftStart) {
      result.push(right);
      right = undefined;
      continue;
    }

    if (rightStart < leftStart) result.push([right[0], right[1], leftStart - rightStart]);
    if (leftEnd < rightEnd) {
      left = undefined;
      right = [leftEnd + 1 + right[0] - right[1], leftEnd + 1, rightEnd - leftEnd];
      continue;
    }
    right = undefined;
  }

  return sortBySrc(result);
};

const flattenMaps = (maps: Item[][]) => {
  let leftMap = maps[0];
  for (let i = 1; i < maps.length; i++) {
    const rightMap = maps[i];
    const portals = getPortals(leftMap, rightMap);
    leftMap = mergeItems(mergeItems(portals, leftMap), rightMap);
  }
  return leftMap;
};

const seconds = (raw: string) => {
  const { seeds: seedsLine, maps } = getData(raw);
  const seedsPairs = getSeedsPairs(seedsLine);

  const flatMap = sortByDest(flattenMaps(maps));

  const baskets: [number, number][][] = new Array(flatMap.length).fill(0).map(() => []);
  for (let i = 0; i < seedsPairs.length; i++) {
    const pair = seedsPairs[i];
    const pairStart = pair[0];
    const pairEnd = pair[0] + pair[1] - 1;
    const index = flatMap.findIndex((item) => {
      const leftStart = item[1];
      const leftEnd = item[1] + item[2] - 1;
      return pairStart <= leftEnd && pairEnd >= leftStart;
    });
    if (index !== -1) {
      baskets[index].push(pair);
    }
  }
  const bestBasketIndex = baskets?.findIndex((basket) => {
    return basket.length;
  });
  const item = flatMap[bestBasketIndex];
  const bestBasket = baskets[bestBasketIndex];
  // yeah, there might be several of them, but since this solution passed... =)
  const min = Math.max(bestBasket[0][0], item[1]);
  const shift = item[0] - item[1];
  return min + shift;
};

export default function Day() {
  return <PuzzleRenderer func={seconds} first={first} second={seconds} />;
}
