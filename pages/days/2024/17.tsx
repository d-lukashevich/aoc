import { PuzzleRenderer } from '@units/PuzzleRenderer';

const getData = (raw: string) => {
  const [, aRegStr, progStr] = raw.match(/Register A: (\d+).+Program: (.+)$/s)!;
  return { aReg: BigInt(aRegStr), prog: progStr.split(',').map(BigInt) };
};
const trunc = (num: bigint) => BigInt(num.toString().split(',')[0]);

const calculateOutput = (aReg: bigint, prog: bigint[]) => {
  let bReg = 0n;
  let cReg = 0n;

  let index = 0;
  const out: bigint[] = [];
  const getCombo = (val: bigint) => {
    if (val < 4) return val;
    if (val === 4n) return aReg;
    if (val === 5n) return bReg;
    if (val === 6n) return cReg;
    throw new Error('Invalid combo');
  };

  while (index < prog.length) {
    const code = Number(prog[index]);
    const next = prog[index + 1];
    index += 2;
    if (code === 0) aReg = trunc(aReg / 2n ** getCombo(next));
    if (code === 1) bReg = bReg ^ next;
    if (code === 2) bReg = getCombo(next) % 8n;
    if (code === 3) aReg !== 0n && (index = Number(next));
    if (code === 4) bReg = bReg ^ cReg;
    if (code === 5) out.push(getCombo(next) % 8n);
    if (code === 6) bReg = trunc(aReg / 2n ** getCombo(next));
    if (code === 7) cReg = trunc(aReg / 2n ** getCombo(next));
  }

  return out;
};

const first = (raw: string) => {
  const { aReg, prog } = getData(raw);
  return calculateOutput(aReg, prog).join(',');
};

const second = (raw: string) => {
  const { prog } = getData(raw);
  let result = 0n;
  while (true) {
    const list = calculateOutput(result, prog);
    const isMatch = list.every((val, i) => list.at(-i - 1) === prog.at(-i - 1));
    if (isMatch) {
      if (list.length === prog.length) break;
      result *= 8n;
    } else {
      result++;
    }
  }

  return Number(result);
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
