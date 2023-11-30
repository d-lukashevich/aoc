import { PuzzleRenderer } from 'components/PuzzleRenderer';
import { Layout } from 'components/Layout';

type Operation = [string, string, string];
type Yell = number | Operation;

const parseOperation = (str: string): Operation => {
  const match = str.match(/(\w+) (.) (\w+)/);
  if (!match) throw new Error('No operation match');
  return [match[2], match[1], match[3]];
};

const getData = (raw: string) => {
  const text = raw.replaceAll('\n', '"],["').replaceAll(': ', '","');
  const preData: [string, string][] = JSON.parse(`[["${text}"]]`);
  return preData.map(([name, yell]): [string, Yell] => {
    const parsedYell = Number.isNaN(Number(yell)) ? parseOperation(yell) : Number(yell);
    return [name, parsedYell];
  });
};

const solveFirst = (raw: string) => {
  const data = getData(raw);
  const map: Record<string, () => number> = {};
  data.forEach(([name, yell]) => {
    if (typeof yell === 'number') {
      map[name] = () => yell;
      return;
    }
    const [operator, operandA, operandB] = yell;
    switch (operator) {
      case '+': {
        map[name] = () => map[operandA]() + map[operandB]();
        break;
      }
      case '-': {
        map[name] = () => map[operandA]() - map[operandB]();
        break;
      }
      case '/': {
        map[name] = () => map[operandA]() / map[operandB]();
        break;
      }
      case '*': {
        map[name] = () => map[operandA]() * map[operandB]();
        break;
      }
    }
  });

  return map.root();
};

const solveSecond = (raw: string) => {
  const data = getData(raw);
  const dataHash = data.reduce((hash: Record<string, [string, Yell]>, monkey) => {
    hash[monkey[0]] = monkey;
    return hash;
  }, {});
  const map: Record<string, () => number> = {};
  const unknownSet = new Set(['humn']);
  const wrap = (func: () => number, name: string) => {
    return () => {
      const result = func();
      if (Number.isNaN(result)) unknownSet.add(name);
      return result;
    };
  };

  data.forEach(([name, yell]) => {
    if (typeof yell === 'number') {
      map[name] = () => yell;
      return;
    }
    const [operator, operandA, operandB] = yell;
    switch (operator) {
      case '+': {
        map[name] = wrap(() => map[operandA]() + map[operandB](), name);
        break;
      }
      case '-': {
        map[name] = wrap(() => map[operandA]() - map[operandB](), name);
        break;
      }
      case '/': {
        map[name] = wrap(() => map[operandA]() / map[operandB](), name);
        break;
      }
      case '*': {
        map[name] = wrap(() => map[operandA]() * map[operandB](), name);
        break;
      }
    }
  });
  map.humn = () => NaN;
  map.root();
  [...unknownSet].forEach((name) => {
    const [, yell] = dataHash[name];
    if (typeof yell === 'number') return;
    const [operator, a, b] = yell;
    if (unknownSet.has(a)) {
      switch (operator) {
        case '+': {
          map[a] = () => map[name]() - map[b]();
          break;
        }
        case '-': {
          map[a] = () => map[name]() + map[b]();
          break;
        }
        case '/': {
          map[a] = () => map[name]() * map[b]();
          break;
        }
        case '*': {
          map[a] = () => map[name]() / map[b]();
          break;
        }
      }
    }
    if (unknownSet.has(b)) {
      switch (operator) {
        case '+': {
          map[b] = () => map[name]() - map[a]();
          break;
        }
        case '-': {
          map[b] = () => map[a]() - map[name]();
          break;
        }
        case '/': {
          map[b] = () => map[a]() / map[name]();
          break;
        }
        case '*': {
          map[b] = () => map[name]() / map[a]();
          break;
        }
      }
    }
  });

  const [, rootA, rootB] = dataHash.root[1] as Operation;
  if (unknownSet.has(rootA)) {
    map[rootA] = () => map[rootB]();
  } else {
    map[rootB] = () => map[rootA]();
  }

  return map.humn();
};

export default function Day() {
  return (
    <Layout>
      <PuzzleRenderer func={solveSecond} first={solveFirst} second={solveSecond} />
    </Layout>
  );
}
