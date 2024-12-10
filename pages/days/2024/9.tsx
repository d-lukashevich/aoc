import { PuzzleRenderer } from '@units/PuzzleRenderer';

const getData = (raw: string) => {
  const arr = [...raw];
  const data: (number | undefined)[] = [];

  let position = 0;
  for (let i = 0; i < arr.length; i += 2) {
    const blocksCount = Number(arr[i] ?? 0);
    const emptyCount = Number(arr[i + 1] ?? 0);
    data.push(...new Array(blocksCount).fill(position));
    position += 1;
    data.push(...new Array(emptyCount).fill(undefined));
  }

  return data;
};

const first = (raw: string) => {
  const data = getData(raw);
  let i = 0;
  let j = data.length - 1;
  while (i < j) {
    if (data[i] !== undefined) {
      i += 1;
    } else if (data[j] === undefined) {
      j -= 1;
    } else {
      data[i] = data[j];
      data[j] = undefined;
      i += 1;
      j -= 1;
    }
  }
  const sumArr: number[] = [];
  for (let p = 0; p <= i; p++) {
    const el = data[p];
    if (el === undefined) break;
    sumArr.push(el * sumArr.length);
  }
  return sumArr.reduce((acc, curr) => acc + curr, 0);
};

const second = (raw: string) => {
  const data = getData(raw);
  const findEmpty = (targetSize: number, limit: number) => {
    let size = 0;
    for (let i = 0; i < data.length; i++) {
      if (i >= limit) return -1;
      if (data[i] === undefined) {
        size += 1;
        if (size === targetSize) return i - size + 1;
      } else {
        size = 0;
      }
    }
    return -1;
  };

  let size = 0;
  for (let i = data.length - 1; i >= -1; i--) {
    if (data[i] !== data[i + 1] && size) {
      const targetI = findEmpty(size, i + 1);
      if (targetI !== -1) {
        while (size) {
          data[targetI + size - 1] = data[i + 1];
          data[i + size] = undefined;
          size--;
        }
      }
      size = 0;
    }
    if (data[i] !== undefined) {
      size += 1;
    }
  }

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += (data[i] || 0) * i;
  }
  return sum;
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={first} />;
}
