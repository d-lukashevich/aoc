import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Rule = [string, string, number, string];

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const rulesStrs: string[] = [];
  const partsStrs: string[] = [];
  let isPart2 = false;
  rows.forEach((row) => {
    if (row === '') {
      isPart2 = true;
      return;
    }
    if (isPart2) return partsStrs.push(row);
    rulesStrs.push(row);
  });

  const ruleRegex = /(.+)\{(.+)}/;
  const singleRuleRegex = /([xmas])([<>])(\d+):(.+)$/;

  const rules = rulesStrs.reduce((acc: Record<string, (Rule | string)[]>, ruleStr) => {
    const [_, name] = ruleStr.match(ruleRegex)!;
    acc[name] = [];
    acc[name] = rulesStrs.map((ruleStr) => {
      const match = ruleStr.match(singleRuleRegex);
      if (!match) return ruleStr;
      const [_, letter, sign, num, dest] = match;
      return [letter, sign, Number(num), dest] as Rule;
    });
    return acc;
  }, {});

  const parts = partsStrs.map((str) =>
    str
      .slice(1, -1)
      .split(',')
      .reduce(
        (acc, item) => {
          const [key, val] = item.split('=');
          acc[key as keyof typeof acc] = Number(val);
          return acc;
        },
        { x: 0, m: 0, a: 0, s: 0 }
      )
  );

  return { parts, rules };
};

const getDest = (part: Part, rules: (string | Rule)[]) => {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (typeof rule === 'string') return rule;
    const [letter, sign, num, dest] = rule;
    const value = part[letter as keyof Part];
    if (sign === '<' && value < num) return dest;
    if (sign === '>' && value > num) return dest;
  }
  throw new Error('No dest found');
};

const first = (raw: string) => {
  const { parts, rules } = getData(raw);
  let sum = 0;
  parts.forEach((part) => {
    const { x, m, a, s } = part;
    let name = 'in';
    while (Infinity) {
      if (name === 'A') {
        sum += x + m + a + s;
        break;
      }
      if (name === 'R') break;
      const rulesArr = rules[name];
      name = getDest(part, rulesArr);
    }
  });

  return sum;
};

type PartRange = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};
type PartTuple = [string, PartRange];

const splitRange = (range: PartRange, rule: Rule) => {
  const [letter, sign, num] = rule;
  const [min, max] = range[letter as keyof PartRange];
  if (sign === '<') {
    if (min >= num) return [null, range];
    if (max < num) return [range, null];
    return [{ ...range, [letter]: [min, num - 1] } as PartRange, { ...range, [letter]: [num, max] } as PartRange];
  }

  if (sign === '>') {
    if (max <= num) return [null, range];
    if (min > num) return [range, null];
    return [{ ...range, [letter]: [num + 1, max] } as PartRange, { ...range, [letter]: [min, num] } as PartRange];
  }
  throw new Error('Unknown sign');
};

const MAX = 4000;
const second = (raw: string) => {
  const { rules } = getData(raw);
  const accepted: PartRange[] = [];
  const queue: PartTuple[] = [['in', { x: [1, MAX], m: [1, MAX], a: [1, MAX], s: [1, MAX] }]];

  while (queue.length) {
    let [name, range] = queue.pop()!;
    if (name === 'A') {
      accepted.push(range);
      continue;
    }
    if (name === 'R') continue;

    let isDone = false;
    rules[name].forEach((rule) => {
      if (isDone) return;
      if (typeof rule === 'string') {
        if (rule === 'A') return accepted.push(range);
        if (rule === 'R') return;
        return queue.push([rule, range]);
      }
      // rule is a Rule
      const [passed, further] = splitRange(range, rule);
      if (passed) queue.push([rule.at(-1) as string, passed]);
      if (!further) {
        isDone = true;
        return;
      }
      range = further;
    });
  }

  return accepted.reduce((acc, range) => {
    const sum = Object.values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1);
    return acc + sum;
  }, 0);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
