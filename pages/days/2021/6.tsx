import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw)[0].split(',').map(Number);

const emulate = (raw: string, days: number) => {
  const data = getData(raw);
  const fishes = new Array(9).fill(0);
  data.forEach((num) => fishes[num]++);
  for (let i = 0; i < days; i++) {
    let temp = 0;
    for (let j = 8; j >= 0; j--) {
      const toAdd = temp;
      temp = fishes[j];
      fishes[j] = toAdd;
    }
    fishes[8] = temp;
    fishes[6] += temp;
  }

  return fishes.reduce((acc, num) => acc + num, 0);
};

const first = (raw: string) => emulate(raw, 80);
const second = (raw: string) => emulate(raw, 256);

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
