import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Coords = [number, number, number];

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const coords = rows.map((row) => row.split(',').map(Number) as Coords);

  const pairs: { junctions: [Coords, Coords]; junctionsStr: [string, string]; distance: number }[] = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const a = coords[i];
      const b = coords[j];

      const distance = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

      pairs.push({ junctions: [a, b], junctionsStr: [rows[i], rows[j]], distance });
    }
  }

  pairs.sort((a, b) => a.distance - b.distance);

  return { rows, pairs };
};

const first = (raw: string) => {
  const { pairs } = getData(raw);

  const circuitsMap = new Map<string, Set<string>>();

  for (let i = 0; i < 1000; i++) {
    const {
      junctionsStr: [a, b],
    } = pairs[i];
    const aCircuits = circuitsMap.get(a);
    const bCircuits = circuitsMap.get(b);

    if (!aCircuits && !bCircuits) {
      const newSet = new Set<string>([a, b]);
      circuitsMap.set(a, newSet);
      circuitsMap.set(b, newSet);
      continue;
    }
    if (aCircuits && !bCircuits) {
      aCircuits.add(b);
      circuitsMap.set(b, aCircuits);
      continue;
    }
    if (!aCircuits && bCircuits) {
      bCircuits.add(a);
      circuitsMap.set(a, bCircuits);
      continue;
    }
    if (aCircuits && bCircuits && aCircuits !== bCircuits) {
      for (const junction of bCircuits) {
        aCircuits.add(junction);
        circuitsMap.set(junction, aCircuits);
      }
    }
  }

  const uniqueCircuits = [...new Set([...circuitsMap.values()])].sort((a, b) => b.size - a.size);
  uniqueCircuits.length = 3;

  return uniqueCircuits.reduce((acc, set) => acc * set.size, 1);
};

const second = (raw: string) => {
  const { rows, pairs } = getData(raw);

  const circuitsMap = new Map<string, Set<string>>();

  for (let i = 0; i < pairs.length; i++) {
    const {
      junctionsStr: [a, b],
      junctions,
    } = pairs[i];
    const aCircuits = circuitsMap.get(a);
    const bCircuits = circuitsMap.get(b);

    if (!aCircuits && !bCircuits) {
      const newSet = new Set<string>([a, b]);
      circuitsMap.set(a, newSet);
      circuitsMap.set(b, newSet);
    } else if (aCircuits && !bCircuits) {
      aCircuits.add(b);
      circuitsMap.set(b, aCircuits);
    } else if (!aCircuits && bCircuits) {
      bCircuits.add(a);
      circuitsMap.set(a, bCircuits);
    } else if (aCircuits && bCircuits && aCircuits !== bCircuits) {
      for (const junction of bCircuits) {
        aCircuits.add(junction);
        circuitsMap.set(junction, aCircuits);
      }
    }

    if (circuitsMap.get(a)?.size === rows.length) {
      return junctions[0][0] * junctions[1][0];
    }
  }

  return rows.length;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
