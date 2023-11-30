import { PuzzleRenderer } from '../../../components/PuzzleRenderer';

type Line = ['addx', number] | ['noop', null];

const getData = (rawText: string): Line[] => {
  const text = '"' + rawText.replaceAll('\n', '","') + '"';
  return JSON.parse(`[${text}]`).map((str: string) => {
    let [action, numStr] = str.split(' ');
    return [action, Number(numStr)];
  });
};

const getXHash = (rawText: string) => {
  const xHash: Record<number, number> = { 0: 1 };
  const data = getData(rawText);

  let counter = 0;
  data.forEach(([action, num]) => {
    counter++;
    xHash[counter] = xHash[counter - 1];
    if (action === 'addx') {
      counter++;
      xHash[counter] = xHash[counter - 1] + num;
    }
  });

  return xHash;
};

const solveFirst = (raw: string) => {
  const xHash = getXHash(raw);

  return [20, 60, 100, 140, 180, 220].reduce((acc, strength) => {
    return acc + strength * xHash[strength - 1];
  }, 0);
};

const solveSecond = (raw: string) => {
  const xHash = getXHash(raw);

  return new Array(6).fill(null).map((_, i) => {
    return new Array(40)
      .fill(null)
      .map((__, j) => {
        const xPos = xHash[i * 40 + j];
        return j < xPos - 1 || j > xPos + 1 ? '.' : '#';
      })
      .join('');
  });
  // EFUGLPAP
};

export default function Day() {
  return <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />;
}
