import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const isBlock = (char: unknown) => !!char && char !== '.';
const isStarBlock = (char: unknown) => char === '*';

const identify = (x: number, y: number, rows: string[]): string => {
  const char = rows[y][x];
  if (isNaN(Number(char))) return '';
  return `${rows[y][x]}${identify(x + 1, y, rows)}`;
};

const first = (raw: string) => {
  const rows = parseRows(raw);
  const chars = rows.map((str) => [...str]);

  const fullNums: number[] = [];

  const checkBlockSection = (x: number, y: number, len: number) => {
    while (len >= 0) {
      if (isBlock(chars[y]?.[x + len])) return true;
      len--;
    }
    return false;
  };

  const isFull = (startX: number, startY: number, len: number) => {
    if (isBlock(chars[startY][startX - 1])) return false;
    if (isBlock(chars[startY][startX + len])) return false;
    if (checkBlockSection(startX - 1, startY - 1, len + 1)) return false;
    return !checkBlockSection(startX - 1, startY + 1, len + 1);
  };

  for (let y = 0; y < chars.length; y++) {
    for (let x = 0; x < chars[0].length; x++) {
      const numStr = identify(x, y, rows);
      if (numStr.length) {
        if (!isFull(x, y, numStr.length)) {
          fullNums.push(Number(numStr));
        }
        x += numStr.length - 1;
      }
    }
  }

  return fullNums.reduce((a, b) => a + b, 0);
};

const second = (raw: string) => {
  const rows = parseRows(raw);

  const checkBlockSection = (x: number, y: number, len: number) => {
    while (len >= 0) {
      if (isStarBlock(rows[y]?.[x + len])) return [x + len, y];
      len--;
    }
    return false;
  };

  const isStarBlocked = (x: number, y: number, len: number) => {
    if (isStarBlock(rows[y][x - 1])) return [x - 1, y];
    if (isStarBlock(rows[y][x + len])) return [x + len, y];
    const top = checkBlockSection(x - 1, y - 1, len + 1);
    if (top) return top;
    const bottom = checkBlockSection(x - 1, y + 1, len + 1);
    if (bottom) return bottom;
    return false;
  };

  const starMap: Record<string, number[]> = {};

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const numStr = identify(x, y, rows);
      if (numStr.length) {
        const starBlock = isStarBlocked(x, y, numStr.length);
        if (starBlock) {
          const key = starBlock.join(',');
          starMap[key] ??= [];
          starMap[key].push(Number(numStr));
        }
        x += numStr.length - 1;
      }
    }
  }

  return Object.values(starMap).reduce((sum, nums) => {
    if (nums.length !== 2) return sum;
    return sum + nums.reduce((acc, num) => acc * num);
  }, 0);
};
// Ohhhh! so dirty solution! :)

export default function Day() {
  return <PuzzleRenderer func={first} first={first} second={second} />;
}
