import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const rows = parseRows(raw).map((row) => [...row]);

  return rows;
};

const count = (map: string[][]) => {
  return map.reduce((acc, row, i) => {
    return (
      acc +
      row.reduce((acc, cell) => {
        return acc + (cell === 'O' ? 1 : 0) * (map.length - i);
      }, 0)
    );
  }, 0);
};

const tiltNorth = (map: string[][]) => {
  let isOn = true;

  while (isOn) {
    isOn = false;
    map.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 'O') return;
        const upCell = map[i - 1]?.[j];
        if (upCell === '.') {
          map[i - 1][j] = 'O';
          map[i][j] = '.';
          isOn = true;
        }
      });
    });
  }

  return map;
};
const tiltWest = (map: string[][]) => {
  let isOn = true;

  while (isOn) {
    isOn = false;
    map.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 'O') return;
        const upCell = map[i][j - 1];
        if (upCell === '.') {
          map[i][j - 1] = 'O';
          map[i][j] = '.';
          isOn = true;
        }
      });
    });
  }

  return map;
};
const tiltSouth = (map: string[][]) => {
  let isOn = true;

  while (isOn) {
    isOn = false;
    map.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 'O') return;
        const upCell = map[i + 1]?.[j];
        if (upCell === '.') {
          map[i + 1][j] = 'O';
          map[i][j] = '.';
          isOn = true;
        }
      });
    });
  }

  return map;
};
const tiltEast = (map: string[][]) => {
  let isOn = true;

  while (isOn) {
    isOn = false;
    map.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 'O') return;
        const upCell = map[i][j + 1];
        if (upCell === '.') {
          map[i][j + 1] = 'O';
          map[i][j] = '.';
          isOn = true;
        }
      });
    });
  }

  return map;
};

const doCycle = (map: string[][]) => {
  return tiltEast(tiltSouth(tiltWest(tiltNorth(map))));
};

const first = (raw: string) => {
  const data = getData(raw);
  return count(tiltNorth(data));
};

const second = (raw: string) => {
  const map = getData(raw);
  let cache: Record<string, number> = {};
  const cycles = 1000000000;

  for (let i = 0; i < cycles; i++) {
    const key = JSON.stringify(map);
    if (key in cache) {
      console.log('wow', i);
      const len = i - cache[key];
      while (i < cycles) {
        i += len;
      }
      i -= len;
      cache = {};
    }
    cache[key] = i;
    doCycle(map);
  }
  return count(map);
};

// code in this solution is super inefficient, but it works :)

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
