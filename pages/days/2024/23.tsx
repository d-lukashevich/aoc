import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const map = new Map<string, Set<string>>();
  parseRows(raw).forEach((row) => {
    const [a, b] = row.split('-');
    if (!map.has(a)) map.set(a, new Set());
    if (!map.has(b)) map.set(b, new Set());
    map.get(a)!.add(a);
    map.get(a)!.add(b);
    map.get(b)!.add(a);
    map.get(b)!.add(b);
  });
  return map;
};

const first = (raw: string) => {
  const map = getData(raw);
  const combos = new Set<string>();
  map.forEach((setA, a) => {
    setA.forEach((b) => {
      if (b === a) return;
      map.get(b)!.forEach((c) => {
        if (c === a || c === b) return;
        if (setA.has(c)) combos.add([a, b, c].sort().join(','));
      });
    });
  });
  return [...combos].filter((combo) => combo[0] === 't' || combo.includes(',t')).length;
};

const second = (raw: string) => {
  const map = getData(raw);

  let largest: string[] = [];

  const seen = new Set<string>();
  const getCombos = (list: string[]) => {
    const key = list.join(',');
    if (seen.has(key)) return;
    seen.add(key);

    const sets = list.map((el) => map.get(el)!);
    const intersections = sets.reduce((acc, el) => acc.intersection(el));

    if (intersections.size && largest.length < list.length) largest = list;

    const candidates = intersections.difference(new Set(list));
    if (!candidates.size) return;

    for (const key of candidates.values()) getCombos([...list, key].sort());
  };

  for (const key of map.keys()) getCombos([key]);
  return largest.join(',');
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
