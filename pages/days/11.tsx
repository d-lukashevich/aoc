import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Monkey = {
  items: number[];
  inspection: (level: number) => number;
  test: (level: number) => number;
  iCount: number;
};

const initMonkeys = (): Monkey[] => [
  {
    items: [97, 81, 57, 57, 91, 61],
    inspection: (level: number) => level * 7,
    test: (level: number) => (level % 11 ? 6 : 5),
    iCount: 0,
  },
  {
    items: [88, 62, 68, 90],
    inspection: (level: number) => level * 17,
    test: (level: number) => (level % 19 ? 2 : 4),
    iCount: 0,
  },
  {
    items: [74, 87],
    inspection: (level: number) => level + 2,
    test: (level: number) => (level % 5 ? 4 : 7),
    iCount: 0,
  },
  {
    items: [53, 81, 60, 87, 90, 99, 75],
    inspection: (level: number) => level + 1,
    test: (level: number) => (level % 2 ? 1 : 2),
    iCount: 0,
  },
  {
    items: [57],
    inspection: (level: number) => level + 6,
    test: (level: number) => (level % 13 ? 0 : 7),
    iCount: 0,
  },
  {
    items: [54, 84, 91, 55, 59, 72, 75, 70],
    inspection: (level: number) => level * level,
    test: (level: number) => (level % 7 ? 3 : 6),
    iCount: 0,
  },
  {
    items: [95, 79, 79, 68, 78],
    inspection: (level: number) => level + 3,
    test: (level: number) => (level % 3 ? 3 : 1),
    iCount: 0,
  },
  {
    items: [61, 97, 67],
    inspection: (level: number) => level + 4,
    test: (level: number) => (level % 17 ? 5 : 0),
    iCount: 0,
  },
];

const getBusiness = (monkeys: Monkey[]) => {
  const sortedMonkeys = monkeys.sort((a, b) => b.iCount - a.iCount);
  return sortedMonkeys[0].iCount * sortedMonkeys[1].iCount;
};

const solveFirst = () => {
  const monkeys = initMonkeys();
  const round = () => {
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        monkey.iCount++;
        item = Math.floor(Math.floor(monkey.inspection(item) / 3));
        monkeys[monkey.test(item)].items.push(item);
      });
      monkey.items = [];
    });
  };

  new Array(20).fill(null).forEach(round);
  return getBusiness(monkeys);
};

const solveSecond = () => {
  const monkeys = initMonkeys();

  const commonDivider = 11 * 19 * 5 * 2 * 13 * 7 * 3 * 17;

  const round = () => {
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        monkey.iCount++;
        item = Math.floor(monkey.inspection(item) % commonDivider);
        monkeys[monkey.test(item)].items.push(item);
      });
      monkey.items = [];
    });
  };

  new Array(10000).fill(null).forEach(round);
  return getBusiness(monkeys);
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={11} func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
