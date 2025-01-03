import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useInput = (year: number, day: number) => {
  return useQuery({
    queryKey: [`input-${year}-${day}`],
    queryFn: (): Promise<string> => {
      return axios.get(`http://localhost:8095/api/puzzle-input?year=${year}&day=${day}`).then((res) => res.data);
    },
  });
};

export const withPerfLog = <Args extends unknown[], Result extends unknown>(fn: (...args: Args) => Result) => {
  return (...args: Args) => {
    const start = performance.now();
    const result = fn(...args);
    console.log(`Took ${performance.now() - start}ms`);
    return result;
  };
};

export const parseRows = (raw: string): string[] => {
  const text = '"' + raw.replaceAll('\n', '","') + '"';
  return JSON.parse(`[${text}]`);
};

export const getNumsList = (str: string) => {
  return str
    .split(' ')
    .filter((str) => str !== '')
    .map(Number);
};

export const withCache = <Args extends unknown[], Result extends unknown>(fn: (...args: Args) => Result) => {
  const cache: Record<string, Result> = {};
  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
export const lcm = (...nums: number[]) => nums.reduce((a, b) => (a * b) / gcd(a, b));
