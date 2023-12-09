import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { getNumsList, parseRows } from '@utils';

const getData = (raw: string) => parseRows(raw).map(getNumsList);

const getPredictions = (nums: number[]): [number, number] => {
  if (!nums.some(Boolean)) return [0, 0];
  const diffs = nums.reduce((acc: number[], num, i) => {
    if (i === 0) return acc;
    acc.push(num - nums[i - 1]);
    return acc;
  }, []);
  const predictions = getPredictions(diffs);
  predictions[0] = nums[0] - predictions[0];
  predictions[1] = nums.at(-1)! + predictions[1];
  return predictions;
};

const first = (raw: string) => {
  const predictions = getData(raw).map(getPredictions);
  return predictions.reduce((acc, prediction) => acc + prediction[1], 0);
};

const second = (raw: string) => {
  const predictions = getData(raw).map(getPredictions);
  return predictions.reduce((acc, prediction) => acc + prediction[0], 0);
};
export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
