import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type IceShard = '<' | 'v' | '^' | '>';
type Map = IceShard[][][];

const getData = (raw: string): Map => {
  const preData = raw.split('\n').map((str) => [...str]);
  return preData.map((row) => row.map((char) => (char === '#' || char === '.' ? [] : [char as IceShard])));
};

const turnBlizzard = (map: Map) => {
  const w = map[0].length;
  const h = map.length;
  const newMap: Map = new Array(h).fill(0).map(() => new Array(w).fill(0).map(() => []));
  for (let i = 1; i < h - 1; i++) {
    for (let j = 1; j < w - 1; j++) {
      map[i][j].forEach((shard) => {
        let k = i;
        let l = j;
        switch (shard) {
          case '<': {
            l = l > 1 ? l - 1 : w - 2;
            break;
          }
          case '>': {
            l = l < w - 2 ? l + 1 : 1;
            break;
          }
          case '^': {
            k = k > 1 ? k - 1 : h - 2;
            break;
          }
          case 'v': {
            k = k < h - 2 ? k + 1 : 1;
            break;
          }
        }
        newMap[k][l].push(shard);
      });
    }
  }
  return newMap;
};

const solve = (raw: string, repeats = 0) => {
  let map = getData(raw);
  const w = map[0].length;
  const h = map.length;

  const starts: [number, number][] = [
    [0, 1],
    [h - 1, w - 2],
  ];
  let counter = 0;

  const isOkMove = (y: number, x: number) => {
    if (starts.some((start) => y === start[0] && x === start[1])) return true;
    if (y < 1 || y > map.length - 2) return false;
    if (x < 1 || x > map[0].length - 2) return false;
    return !map[y][x].length;
  };

  let positionsHash: Record<string, [number, number]> = {};
  const addPosition = (...position: [number, number]) => {
    const key = position.join();
    if (!positionsHash[key]) positionsHash[key] = position;
  };
  addPosition(...starts[0]);

  for (let i = 0; i < 1000; i++) {
    const target = starts[(counter + 1) % 2];
    map = turnBlizzard(map);
    const positions = Object.values(positionsHash);
    positionsHash = {};
    for (let j = 0; j < positions.length; j++) {
      const [y, x] = positions[j];
      // finish
      if (y === target[0] && x === target[1]) {
        if (repeats - counter) {
          counter++;
          positionsHash = {};
          addPosition(...starts[counter % 2]);
          break;
        } else {
          return i;
        }
      }
      if (isOkMove(y, x)) addPosition(y, x);
      if (isOkMove(y, x - 1)) addPosition(y, x - 1);
      if (isOkMove(y, x + 1)) addPosition(y, x + 1);
      if (isOkMove(y - 1, x)) addPosition(y - 1, x);
      if (isOkMove(y + 1, x)) addPosition(y + 1, x);
    }
  }

  throw new Error('Most likely it is an infinite loop');
};

const solveFirst = (raw: string) => solve(raw, 0);
const solveSecond = (raw: string) => solve(raw, 2);

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer day={24} func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
