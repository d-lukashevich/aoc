import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const getData = (raw: string) => {
  const mapRows: string[] = [];
  const movesRows: string[] = [];
  parseRows(raw).forEach((row) => {
    if (row.startsWith('#')) return mapRows.push(row);
    if (row === '') return;
    movesRows.push(row);
  });
  const map = mapRows.map((row) => row.split(''));
  const moves = [...movesRows.map((str) => [...str]).flat()] as MoveSign[];

  return { map, moves };
};

const getRobotPos = (map: string[][]) => {
  return map.reduce((acc: Pos | undefined, row, y) => {
    const x = row.findIndex((cell) => cell === '@');
    if (x !== -1) return [x, y] as Pos;
    return acc;
  }, undefined)!;
};

type Pos = [number, number];
type MoveSign = '<' | '>' | '^' | 'v';
const getNextPos = (move: MoveSign, [x, y]: Pos): Pos => {
  switch (move) {
    case '<':
      return [x - 1, y];
    case '>':
      return [x + 1, y];
    case '^':
      return [x, y - 1];
    case 'v':
      return [x, y + 1];
  }
};

const calcResult = (map: string[][]) => {
  return map.reduce((acc, row, y) => {
    row.forEach((cell, x) => {
      if (cell === '[' || cell === '0') acc += 100 * y + x;
    });
    return acc;
  }, 0);
};

const first = (raw: string) => {
  const { map, moves } = getData(raw);
  let robotPosition = getRobotPos(map);

  const doMove = (move: MoveSign, [x, y]: Pos, obj: string) => {
    const value = map[y][x];
    if (value === '#') return false;
    if (value === '.' || doMove(move, getNextPos(move, [x, y]), value)) {
      map[y][x] = obj;
      return true;
    }
    return false;
  };

  moves.forEach((move) => {
    const hasMoved = doMove(move, robotPosition!, '.');
    if (hasMoved) robotPosition = getNextPos(move, robotPosition);
  });

  return calcResult(map);
};

const second = (raw: string) => {
  const { map: _map, moves } = getData(raw);
  const map = _map.map((row) => {
    return row.reduce((acc: string[], value) => {
      if (value === '@') acc.push('@', '.');
      if (value === 'O') acc.push('[', ']');
      if (value === '.') acc.push('.', '.');
      if (value === '#') acc.push('#', '#');
      return acc;
    }, []);
  });

  let robotPosition = getRobotPos(map);

  const doXMove = (move: MoveSign, [x, y]: Pos, obj: string) => {
    if (move === '^' || move === 'v') throw new Error('Invalid move');
    const value = map[y][x];
    if (value === '#') return false;
    if (value === '.' || doXMove(move, getNextPos(move, [x, y]), value)) {
      map[y][x] = obj;
      return true;
    }
    return false;
  };

  const checkYMove = (move: MoveSign, [x, y]: Pos): boolean => {
    const value = map[y][x];
    if (value === '#') return false;
    if (value === '.') return true;
    const otherPos: Pos = [value === '[' ? x + 1 : x - 1, y];
    return checkYMove(move, getNextPos(move, [x, y])) && checkYMove(move, getNextPos(move, otherPos));
  };

  const doYMove = (move: MoveSign, [x, y]: Pos, obj: string, final?: boolean) => {
    if (move === '<' || move === '>') throw new Error('Invalid move');
    const value = map[y][x];
    if (value === '.') {
      map[y][x] = obj;
      return;
    }
    if (value === '@' || final) {
      doYMove(move, getNextPos(move, [x, y]), value);
      map[y][x] = obj;
      return;
    }
    // to move both parts of the object
    const otherPos: Pos = [value === '[' ? x + 1 : x - 1, y];
    doYMove(move, [x, y], obj, true);
    doYMove(move, otherPos, '.', true);
  };

  moves.forEach((move) => {
    let hasMoved: boolean;
    if (move === '<' || move === '>') {
      hasMoved = doXMove(move, robotPosition, '.');
    } else {
      hasMoved = checkYMove(move, getNextPos(move, robotPosition));
      if (hasMoved) doYMove(move, robotPosition, '.');
    }
    if (hasMoved) robotPosition = getNextPos(move, robotPosition);
  });

  return calcResult(map);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={first} />;
}
