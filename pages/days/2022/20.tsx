import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Item = { value: number };

const getData = (raw: string): number[] => {
  const text = raw.replaceAll('\n', ',');
  return JSON.parse(`[${text}]`);
};

const solve = (raw: string, decryptionKey = 1, rounds = 1) => {
  const data = getData(raw).map((num) => num * decryptionKey);
  const len = data.length;
  const indexLen = len - 1;

  const items: Item[] = data.map((value) => ({ value }));
  const slots = [...items];

  for (let i = 0; i < rounds; i++) {
    items.forEach((item) => {
      const moves = item.value % indexLen;
      if (!moves) return;

      const startIndex = slots.indexOf(item);
      if (startIndex === undefined) throw new Error('should not happen');

      let newIndex = (startIndex + moves) % indexLen;
      if (moves < 0 && newIndex === 0) {
        newIndex = len - 1;
      }

      let temp = slots.splice(startIndex, 1);
      slots.splice(newIndex, 0, temp[0]);

      if (moves > 0 && newIndex === len - 1) {
        temp = slots.splice(len - 2, 1);
        slots.unshift(temp[0]);
      }
    });
  }

  const zeroIndex = slots.findIndex(({ value }) => value === 0);
  return [1000, 2000, 3000].reduce((acc, position) => acc + slots[(zeroIndex + position) % len].value, 0);
};

const solveFirst = (raw: string) => solve(raw);
const solveSecond = (raw: string) => solve(raw, 811589153, 10);

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
