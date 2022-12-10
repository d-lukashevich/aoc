import { PuzzleRenderer } from '../../components/PuzzleRenderer';

const solve = (raw: string) => {
  const text = '"' + raw.replaceAll('\n', '","') + '"';
  const data: [string, number][] = JSON.parse(`[${text}]`).map((str: string) => {
    const match = str.match(/(.) (\d)/);
    if (!match) return null;
    const [, letter, moves] = match;
    return [letter, Number(moves)];
  });

  return data;
};

export default function Day() {
  return <PuzzleRenderer day={9} func={solve} />;
}
