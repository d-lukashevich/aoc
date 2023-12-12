import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useInput = (year: number, day: number) => {
  return useQuery({
    queryKey: [`input-${year}-${day}`],
    queryFn: (): Promise<string> => {
      return axios.get(`http://localhost:8090/api/puzzle-input?year=${year}&day=${day}`).then((res) => res.data);
    },
  });
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
