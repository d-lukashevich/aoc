import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const nodesRegex = /(.+): (\d)/;
const gatesRegex = /(.+) (AND|XOR|OR) (.+) -> (.+)$/;

type GateType = 'AND' | 'XOR' | 'OR';

const getData = (raw: string) => {
  let secSection = false;
  const nodes: [string, number][] = [];
  const gates: { a: string; b: string; type: GateType; c: string }[] = [];

  parseRows(raw).forEach((row) => {
    if (row === '') return (secSection = true);
    if (secSection) {
      const [, a, type, b, c] = row.match(gatesRegex)!;
      return gates.push({ a, type: type as GateType, b, c });
    }
    const [, node, value] = row.match(nodesRegex)!;
    nodes.push([node, Number(value)]);
  });

  return { nodes, gates };
};

const calcValue = (a: number, b: number, type: GateType): number => {
  if (type === 'AND') return a & b;
  if (type === 'OR') return a | b;
  if (type === 'XOR') return a ^ b;
  throw new Error('Invalid type');
};

const first = (raw: string) => {
  const { nodes, gates } = getData(raw);
  const nodesMap = new Map(nodes);
  const gatesMap = new Map(gates.map((g) => [g.c, [g.a, g.b, g.type] as const]));

  const getValue = (node: string): number => {
    const knownNode = nodesMap.get(node);
    if (knownNode !== undefined) return knownNode;
    const [a, b, type] = gatesMap.get(node)!;
    const aValue = getValue(a);
    const bValue = getValue(b);
    const result = calcValue(aValue, bValue, type);
    nodesMap.set(node, result);
    return result;
  };

  const zKeys = [...gatesMap.keys()].filter((key) => key.startsWith('z')).sort((a, b) => b.localeCompare(a));
  zKeys.forEach(getValue);
  const bin = zKeys.map((key) => nodesMap.get(key)).join('');
  return parseInt(bin, 2);
};

const second = () => {
  // Solved manually.
  // Since I don't know what exact changes are possible, it feels redundant to provide general solution.
  // My general observations helping find culprits:
  // - XOR of Xi and Yi in its XOR should produce zi
  // - AND of Xi and Yi should further have only single OR combination
  const replacements = [
    ['z10', 'mwk'],
    ['z18', 'qgd'],
    ['z33', 'gqp'],
    ['hsw', 'jmh'],
  ];
  return replacements.flat().sort().join(',');
};

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
