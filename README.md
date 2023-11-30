This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project is done as a simple helper for Advent of Code challenges allowing to run the code in the browser, visualize puzzles and your answers.
This project is not of high code quality and challenges answers are not meant to be optimal.

If you want to learn more about AoC - visit [Advent of Code](https://adventofcode.com/) website.

# Usage

- Create your own `.env` file in the root of the project
- Check your cookies in the `https://adventofcode.com`, copy the `session` cookie value as `AOC_TOKEN` variable in `.env` file
- Create a year folder in `pages/days` (i.e. `pages/days/2020`)
- Add `{number}.tsx` files for each day you want to solve (i.e. `pages/days/2020/1.tsx`)
- Each day file should export default React component returning `PuzzleRenderer` element
- `PuzzleRenderer` element should have `func` prop with a function that solves the puzzle (it will receive the puzzle input as a string)

# Example
```tsx
import { PuzzleRenderer } from '../../../components/PuzzleRenderer';
const solve = (input: string) => {
  // your code here
};
export default function Day() {
  return <PuzzleRenderer func={solve} />;
}
```
