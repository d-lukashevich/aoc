import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const maps: string[][] = [[]];
  for (const row of rows) {
    if (!row) {
      maps.push([]);
    } else {
      maps.at(-1)!.push(row);
    }
  }

  const rotatedMaps = maps.map((map) => {
    const rotatedMap: string[] = new Array(map[0].length);
    for (const row of map) {
      for (const [index, char] of row.split('').entries()) {
        rotatedMap[index] = (rotatedMap[index] || '') + char;
      }
    }
    return rotatedMap;
  });

  return { maps, rotatedMaps };
};

const findLineOfReflection = (map: string[]): number | null => {
  for (let i = 0; i < map.length - 1; i++) {
    for (let j = Math.min(i, map.length - i - 2); j >= 0; j--) {
      if (map[i - j] !== map[i + j + 1]) break;
      if (j === 0) return i + 1;
    }
  }
  return null;
};

function replaceAt(str: string, index: number, replacement: string) {
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

const findLineOfReflectionWithSmudge = (_map: string[]): number | null => {
  for (let p = _map.length * _map[0].length - 1; p >= 0; p--) {
    const map = [..._map];
    const smudgeI = Math.floor(p / _map[0].length);
    const smudgeJ = p % _map[0].length;
    const char = map[smudgeI][smudgeJ];
    map[smudgeI] = replaceAt(map[smudgeI], smudgeJ, char === '#' ? '.' : '#');

    for (let i = 0; i < map.length - 1; i++) {
      let isSmudgeChecked = false;
      for (let j = Math.min(i, map.length - i - 2); j >= 0; j--) {
        if (i - j === smudgeI || i + j + 1 === smudgeI) isSmudgeChecked = true;
        if (map[i - j] !== map[i + j + 1]) break;
        if (j === 0 && isSmudgeChecked) {
          console.log(map, i, smudgeI, smudgeJ);
          return i + 1;
        }
      }
    }
  }
  return null;
};

const first = (raw: string) => {
  const { maps, rotatedMaps } = getData(raw);

  const score = maps.reduce((acc, map, i) => {
    const mapScore = findLineOfReflection(map);
    if (mapScore === null) return findLineOfReflection(rotatedMaps[i]!)! + acc;
    return 100 * mapScore + acc;
  }, 0);

  return score;
};

const second = (raw: string) => {
  const { maps, rotatedMaps } = getData(raw);

  const score = maps.reduce((acc, map, i) => {
    const mapScore = findLineOfReflectionWithSmudge(map);
    if (mapScore === null) {
      const mapScoreRotated = findLineOfReflectionWithSmudge(rotatedMaps[i]!);
      if (mapScoreRotated === null) throw new Error('No solution found');
      return mapScoreRotated + acc;
    }
    return 100 * mapScore + acc;
  }, 0);

  return score;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
