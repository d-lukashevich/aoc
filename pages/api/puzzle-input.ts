// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import * as process from 'process';

const AOC_HOST = 'https://adventofcode.com';
const aocOptions = {
  method: 'get',
  headers: {
    'Content-Type': 'text/plain',
    Cookie: `session=${process.env.AOC_TOKEN}`,
  },
};

const schema = z.object({ year: z.string().transform(Number), day: z.string().transform(Number) });

export default async function handler({ query }: NextApiRequest, res: NextApiResponse<string>) {
  const parsedQuery = schema.safeParse(query);
  if (!parsedQuery.success) {
    res.status(400).json('Invalid query');
    return;
  }
  const { year, day } = parsedQuery.data;

  let puzzle: string | undefined;

  const folderPath = path.resolve('./public', `inputs/${year}`);
  const filePath = `${folderPath}/${day}.txt`;
  try {
    puzzle = fs.readFileSync(filePath).toString();
  } catch (error) {}
  if (!puzzle) {
    try {
      const aocResponse = await fetch(`${AOC_HOST}/${year}/day/${day}/input`, aocOptions);
      puzzle = await aocResponse.text();
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
      fs.writeFileSync(filePath, puzzle, 'utf-8');
    } catch (error) {}
  }

  if (!puzzle) {
    res.status(404).json('Puzzle not found');
    return res;
  }

  res.status(200).json(puzzle.trim());
}
