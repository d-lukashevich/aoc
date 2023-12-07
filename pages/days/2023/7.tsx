import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { parseRows } from '@utils';

const convertCardsToNums = (cards: string[], withJokers: boolean) => {
  return cards.map((card) => {
    if (card === 'A') return 14;
    if (card === 'K') return 13;
    if (card === 'Q') return 12;
    if (card === 'J') return withJokers ? 1 : 11;
    if (card === 'T') return 10;
    return Number(card);
  });
};

const getHandType = (cards: number[], withJokers: boolean, jokersCount: number) => {
  const arr = cards
    .reduce((acc: number[], card) => {
      if (withJokers && card === 1) return acc;
      acc[card] ??= 0;
      acc[card]++;
      return acc;
    }, [])
    .sort((a, b) => b - a);
  if (withJokers) {
    arr[0] ??= 0;
    arr[0] += jokersCount;
  }

  if (arr[0] === 5) return 6;
  if (arr[0] === 4) return 5;
  if (arr[0] === 3 && arr[1] === 2) return 4;
  if (arr[0] === 3) return 3;
  if (arr[0] === 2 && arr[1] === 2) return 2;
  if (arr[0] === 2) return 1;
  return 0;
};

const getData = (raw: string, withJokers = false) => {
  const rows = parseRows(raw);
  return rows.map((row) => {
    const [cardsStr, bidStr] = row.split(' ');
    const bid = Number(bidStr);
    const cardsStrings = [...cardsStr];
    const cardsNums = convertCardsToNums(cardsStrings, withJokers);
    const jokersCount = cardsNums.filter((num) => num === 1 || num === 11).length;
    const typeRank = getHandType(cardsNums, withJokers, jokersCount);
    return { cardsNums, bid, typeRank, cardsStr, jokersCount };
  });
};

const getWinnings = (hands: ReturnType<typeof getData>) => {
  const sortedHands = hands.sort((a, b) => {
    if (a.typeRank !== b.typeRank) return b.typeRank - a.typeRank;
    for (let i = 0; i < 5; i++) {
      if (a.cardsNums[i] !== b.cardsNums[i]) return b.cardsNums[i] - a.cardsNums[i];
    }
    throw new Error('Someone is cheating!');
  });

  return sortedHands.reduce((acc, hand, i) => {
    return (sortedHands.length - i) * hand.bid + acc;
  }, 0);
};

const first = (raw: string) => getWinnings(getData(raw));
const second = (raw: string) => getWinnings(getData(raw, true));

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
