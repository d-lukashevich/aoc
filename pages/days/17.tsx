import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

const getData = (raw: string) => {
  return [...raw].map((f) => (f === '>' ? 1 : -1));
};

const shapes = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

const shiftLimits = [3, 4, 4, 6, 5];

const getHash = (chamber: number[][], shapeNum: number, patternPos: number) => {
  const isLast = (line: number) => {
    for (let i = 0; i < 7; i++) {
      if (!chamber[line][i] && !chamber[line + 1]?.[i]) return false;
    }
    return true;
  };
  let hash = `${patternPos};${shapeNum};`;
  for (let i = chamber.length - 1; i >= 0; i--) {
    if (isLast(i)) return hash;
    hash += chamber[i].join(',');
    hash += ';';
  }
  return hash;
};

const solve = (raw: string, limit: number) => {
  const data = getData(raw);
  const chamber = [[1, 1, 1, 1, 1, 1, 1]];

  let rockCounter = 0;

  const checkCollide = (x: number, y: number) => {
    const shape = shapes[rockCounter % 5];
    for (let lineNum = 0; lineNum < shape.length; lineNum++) {
      const chamberLine = chamber[y + lineNum];
      if (!chamberLine) return false;
      const shapeLine = shape.at(-1 - lineNum) as number[];
      for (let colNum = 0; colNum < shapeLine.length; colNum++) {
        if (chamberLine[colNum + x] && shapeLine[colNum]) return true;
      }
    }
    return false;
  };

  const updateChamber = () => {
    const shape = shapes[rockCounter % 5];
    shape.forEach((shapeLine, i) => {
      const rowNum = yPos + shape.length - i - 1;
      chamber[rowNum] ??= new Array(7).fill(0);
      shapeLine.forEach((shapeSign, j) => {
        if (shapeSign) chamber[rowNum][j + xShift] = shapeSign;
      });
    });
  };

  let turn = 0;
  let xShift = 2;
  let yPos = 4;

  let addon = 0;
  const hashMap: Record<string, [number, number]> = {};

  while (rockCounter < limit) {
    const shapeNum = rockCounter % 5;
    const patternPos = turn % data.length;

    const xCandidate = xShift + data[patternPos];
    if (xCandidate >= 0 && xCandidate <= shiftLimits[shapeNum]) {
      if (!checkCollide(xCandidate, yPos)) xShift = xCandidate;
    }

    const yCandidate = yPos - 1;
    if (checkCollide(xShift, yCandidate)) {
      updateChamber();
      const hash = getHash(chamber, shapeNum, patternPos);
      if (!addon && hash in hashMap) {
        const [score, counter] = hashMap[hash];
        const counterDiff = rockCounter - counter;
        const left = (limit - rockCounter) % counterDiff;

        const times = Math.floor((limit - counter) / counterDiff);
        const scoreDiff = chamber.length - 1 - score;

        addon = (times - 1) * scoreDiff;
        rockCounter = limit - left;
      } else {
        hashMap[hash] = [chamber.length - 1, rockCounter];
      }

      xShift = 2;
      yPos = chamber.length + 3;
      rockCounter++;
    } else {
      yPos = yCandidate;
    }

    turn++;
  }

  return chamber.length - 1 + addon;
};

const solveFirst = (raw: string) => solve(raw, 2022);
const solveSecond = (raw: string) => solve(raw, Math.pow(10, 12));

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={17} func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
