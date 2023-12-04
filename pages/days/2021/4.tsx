import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

type Card = number[][];

const getData = (raw: string) => {
  const rows = parseRows(raw);
  const nums = rows[0].split(',').map(Number);
  const cards: Card[] = [];
  let card: Card | undefined = undefined;
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row) {
      cards.push(card!);
      card = undefined;
      continue;
    }
    card ??= [];
    card.push(
      row
        .split(' ')
        .filter((str) => str !== '')
        .map(Number)
    );
  }
  if (card) cards.push(card);

  const coordsHash = cards.reduce((acc: Record<string, [number, number, number][]>, card, i) => {
    card.forEach((row, y) => {
      row.forEach((num, x) => {
        acc[num] ??= [];
        acc[num].push([i, y, x]);
      });
    });
    return acc;
  }, {});

  return { nums, cards, coordsHash };
};

const first = (raw: string) => {
  const { nums, cards, coordsHash } = getData(raw);
  const results: Record<string, number[]> = {};
  const drawSet = new Set<number>();

  let index = 0;
  let winnerCard: number | undefined = undefined;
  while (index < nums.length) {
    const num = nums[index];
    drawSet.add(num);
    const coords = coordsHash[num];
    if (coords) {
      coords.forEach(([i, y, x]) => {
        const yKey = `${i}-y${y}`;
        const xKey = `${i}-x${x}`;
        results[yKey] ??= [];
        results[xKey] ??= [];
        results[yKey].push(num);
        results[xKey].push(num);
        if (results[yKey].length === 5 || results[xKey].length === 5) {
          // console.log(yKey, results[yKey], xKey, results[xKey]);
          winnerCard = i;
        }
      });
    }
    if (winnerCard !== undefined) break;
    index++;
  }
  if (winnerCard === undefined) throw new Error('No winner card');

  return cards[winnerCard].flat().reduce((acc, num) => (drawSet.has(num) ? acc : acc + num), 0) * nums[index];
};

const second = (raw: string) => {
  const { nums, cards, coordsHash } = getData(raw);
  const results: Record<string, number[]> = {};
  const drawSet = new Set<number>();
  const cardsSet = new Set(new Array(cards.length).fill(0).map((_, i) => i));

  let index = 0;
  let winnerCard: number | undefined = undefined;
  while (index < nums.length) {
    const num = nums[index];
    drawSet.add(num);
    const coords = coordsHash[num];
    if (coords) {
      coords.forEach(([i, y, x]) => {
        if (!cardsSet.has(i)) return;
        const yKey = `${i}-y${y}`;
        const xKey = `${i}-x${x}`;
        results[yKey] ??= [];
        results[xKey] ??= [];
        results[yKey].push(num);
        results[xKey].push(num);
        if (results[yKey].length === 5 || results[xKey].length === 5) {
          cardsSet.delete(i);
          if (!cardsSet.size) winnerCard = i;
        }
      });
    }
    if (winnerCard !== undefined) break;
    index++;
  }
  if (winnerCard === undefined) throw new Error('No winner card');

  return cards[winnerCard].flat().reduce((acc, num) => (drawSet.has(num) ? acc : acc + num), 0) * nums[index];
};
export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
