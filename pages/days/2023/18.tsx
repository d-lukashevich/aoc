import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const regex = /(.) (\d+) \(#(.{5})(.)\)/;

const getData = (raw: string) => {
  return parseRows(raw).map((row) => {
    const [, dir, meters, mHexStr, dirHexNumStr] = row.match(regex)!;
    let dirHex = 'R';
    if (dirHexNumStr === '1') dirHex = 'D';
    if (dirHexNumStr === '2') dirHex = 'L';
    if (dirHexNumStr === '3') dirHex = 'U';
    return {
      dir,
      meters: Number(meters),
      mHex: parseInt(mHexStr, 16),
      dirHex,
    };
  });
};

const solve = (data: [string, number][]) => {
  let x = 0;
  let y = 0;
  let interior = 0;

  data.forEach(([dir, meters]) => {
    const prevX = x;
    const prevY = y;
    if (dir === 'R') x += meters;
    if (dir === 'L') x -= meters;
    if (dir === 'U') y -= meters;
    if (dir === 'D') y += meters;
    interior += (prevX * y - x * prevY) / 2;
  });

  const line = data.reduce((acc, [_, meters]) => acc + meters, 0) / 2 + 1;
  return interior + line;
};

const first = (raw: string) => {
  const data = getData(raw).map(({ dir, meters }) => [dir, meters] as [string, number]);
  return solve(data);
};

const second = (raw: string) => {
  const data = getData(raw).map(({ dirHex, mHex }) => [dirHex, mHex] as [string, number]);
  return solve(data);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
