import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const findPair = (nums: number[], target: number) => {
  const numsSet = new Set(nums);
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numsSet.has(complement)) return [nums[i], complement];
  }
};
const first = (raw: string) => {
  const nums = parseRows(raw).map((num) => Number(num));
  const pair = findPair(nums, 2020)!;
  return pair[0] * pair[1];
};

const findTriple = (nums: number[], target: number) => {
  const numsSet = new Set(nums);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const subSum = nums[i] + nums[j];
      if (subSum >= target) continue;
      const complement = target - subSum;
      if (numsSet.has(complement)) return [nums[i], nums[j], complement];
    }
  }
};
const second = (raw: string) => {
  const nums = parseRows(raw).map((num) => Number(num));
  const triple = findTriple(nums, 2020)!;
  return triple[0] * triple[1] * triple[2];
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
