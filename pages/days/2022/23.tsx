import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type HashEntry = { destination: [number, number]; targets: [number, number][] };

const getData = (raw: string, offset = 10) => {
  const preData = raw.split('\n');
  const data: string[][] = new Array(offset).fill(0).map(() => []);
  preData.forEach((str) => {
    const arr = new Array(offset);
    arr.push(...str);
    data.push(arr);
  });
  for (let i = 0; i < offset; i++) {
    data.push([]);
  }
  return data;
};

const moveOrder = (order: string[]) => order.push(order.shift() as string);

const checkDir = (...chars: string[]) => !chars.some((char) => char === '#');
const checkers: Record<string, (i: number, j: number, map: string[][]) => false | [number, number]> = {
  N: (i, j, map) => {
    return checkDir(map[i - 1][j - 1], map[i - 1][j], map[i - 1][j + 1]) && [i - 1, j];
  },
  S: (i, j, map) => {
    return checkDir(map[i + 1][j - 1], map[i + 1][j], map[i + 1][j + 1]) && [i + 1, j];
  },
  W: (i, j, map) => {
    return checkDir(map[i - 1][j - 1], map[i][j - 1], map[i + 1][j - 1]) && [i, j - 1];
  },
  E: (i, j, map) => {
    return checkDir(map[i - 1][j + 1], map[i][j + 1], map[i + 1][j + 1]) && [i, j + 1];
  },
};
const checkPosition = (i: number, j: number, order: string[], map: string[][]) => {
  if (
    checkDir(
      map[i - 1][j - 1],
      map[i - 1][j],
      map[i - 1][j + 1],
      map[i][j - 1],
      map[i][j + 1],
      map[i + 1][j - 1],
      map[i + 1][j],
      map[i + 1][j + 1]
    )
  ) {
    return null;
  }
  for (let d = 0; d < order.length; d++) {
    const candidate = checkers[order[d]](i, j, map);
    if (candidate) return candidate;
  }
  return null;
};

const count = (map: string[][]) => {
  let left: number;
  let right: number;
  let top: number;
  let bottom: number;
  let counter = 0;
  map.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === '#') {
        counter++;
        if (!left || j < left) left = j;
        if (!right || j > right) right = j;
        if (!top || i < top) top = i;
        if (!bottom || i > bottom) bottom = i;
      }
    });
  });
  // @ts-ignore
  return (right - left + 1) * (bottom - top + 1) - counter;
};

const solveFirst = (raw: string) => {
  const data = getData(raw, 10);
  const order = ['N', 'S', 'W', 'E'];

  const turn = () => {
    const hash: Record<string, HashEntry> = {};

    data.forEach((row, rowI) => {
      row.forEach((cell, cellI) => {
        if (cell !== '#') return;
        const destination = checkPosition(rowI, cellI, order, data);
        if (!destination) return;
        const key = destination.join();
        hash[key] ??= { destination, targets: [] };
        hash[key].targets.push([rowI, cellI]);
      });
    });

    Object.values(hash).forEach(({ destination, targets }) => {
      if (targets.length === 1) {
        const target = targets[0];
        data[destination[0]][destination[1]] = '#';
        delete data[target[0]][target[1]];
      }
    });

    moveOrder(order);
  };

  for (let i = 0; i < 10; i++) {
    turn();
  }

  return count(data);
};

const solveSecond = (raw: string) => {
  const data = getData(raw, 80);
  const order = ['N', 'S', 'W', 'E'];

  const turn = () => {
    let noMove = true;
    const hash: Record<string, HashEntry> = {};

    data.forEach((row, rowI) => {
      row.forEach((cell, cellI) => {
        if (cell !== '#') return;
        const destination = checkPosition(rowI, cellI, order, data);
        if (!destination) return;
        const key = destination.join();
        hash[key] ??= { destination, targets: [] };
        hash[key].targets.push([rowI, cellI]);
      });
    });

    Object.values(hash).forEach(({ destination, targets }) => {
      if (targets.length === 1) {
        noMove = false;
        const target = targets[0];
        data[destination[0]][destination[1]] = '#';
        delete data[target[0]][target[1]];
      }
    });

    moveOrder(order);
    return noMove;
  };

  for (let i = 0; i < Infinity; i++) {
    if (turn()) return i + 1;
  }
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveFirst} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
