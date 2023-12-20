import { PuzzleRenderer } from '@units/PuzzleRenderer';
import { lcm, parseRows } from '@utils';

type Module = {
  name: string;
  modules: string[];
  sign: string;
};

type Signal = [string, 'low' | 'high', string];

const getData = (raw: string) => {
  const data = parseRows(raw).map((row) => {
    const [left, right] = row.split('->');
    const sign = left[0];
    const name = (sign !== 'b' ? left.slice(1) : left).trim();
    const modules = right.split(',').map((module) => module.trim());
    return { name, modules, sign };
  });

  const map = data.reduce((acc: Record<string, Module>, { name, modules, sign }) => {
    acc[name] = { name, modules, sign };
    return acc;
  }, {});

  const flipFlops = Object.entries(map).reduce((acc: Record<string, boolean>, [name, { sign }]) => {
    if (sign === '%') acc[name] = false;
    return acc;
  }, {});

  const allC = Object.entries(map).reduce((acc, [name, { sign }]) => {
    if (sign === '&') acc.add(name);
    return acc;
  }, new Set<string>());
  const conjunctions = Object.entries(map).reduce(
    (acc: Record<string, Record<string, boolean>>, [name, { modules }]) => {
      modules.forEach((module) => {
        if (!allC.has(module)) return acc;
        acc[module] = acc[module] ?? {};
        acc[module][name] = false;
      });
      return acc;
    },
    {}
  );

  return { map, flipFlops, conjunctions };
};

const run = ({
  map,
  flipFlops,
  conjunctions,
  onSignal,
  onC,
}: {
  map: Record<string, Module>;
  flipFlops: Record<string, boolean>;
  conjunctions: Record<string, Record<string, boolean>>;
  onSignal?: (signal: 'low' | 'high') => void;
  onC?: (name: string) => void;
}) => {
  const signals: Signal[] = [['broadcaster', 'low', 'button']];

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const [name, value, input] = signal;
    onSignal?.(value);
    if (!map[name]) continue;
    const { sign, modules } = map[name];

    switch (sign) {
      case '%': {
        if (value === 'low') {
          modules.forEach((module) => {
            signals.push([module, flipFlops[name] ? 'low' : 'high', name]);
          });
          flipFlops[name] = !flipFlops[name];
        }
        break;
      }
      case '&': {
        conjunctions[name][input] = value === 'high';
        const isHigh = Object.values(conjunctions[name]).every(Boolean);
        onC?.(name);
        modules.forEach((module) => {
          signals.push([module, isHigh ? 'low' : 'high', name]);
        });
        break;
      }
      default: {
        if (name === 'broadcaster') {
          modules.forEach((module) => {
            signals.push([module, value, name]);
          });
        }
      }
    }
  }
};

const first = (raw: string) => {
  const { map, flipFlops, conjunctions } = getData(raw);
  const calls = { low: 0, high: 0 };

  const onSignal = (signal: 'low' | 'high') => calls[signal]++;
  for (let i = 0; i < 1000; i++) {
    run({ map, flipFlops, conjunctions, onSignal });
  }

  return calls.low * calls.high;
};

const second = (raw: string) => {
  const { map, flipFlops, conjunctions } = getData(raw);

  // Analyzing the data input: preRx is always a conjunction with inputs getting "high" in a cycle
  const preRx = Object.entries(map).find(([_, { modules }]) => modules.includes('rx'))?.[0]!;
  const deciders = Object.entries(conjunctions[preRx]).reduce((acc: Record<string, number>, [name]) => {
    acc[name] = 0;
    return acc;
  }, {});

  let runI = 1;

  const onC = (name: string) => {
    if (name !== preRx) return;
    Object.entries(conjunctions[name]).forEach(([name, value]) => {
      if (value) deciders[name] ||= runI;
    });
  };

  while (runI < 100000 && !Object.values(deciders).every(Boolean)) {
    run({ map, flipFlops, conjunctions, onC });
    runI++;
  }

  return lcm(...Object.values(deciders));
};

export default function Day() {
  return <PuzzleRenderer func={second} first={first} second={second} />;
}
