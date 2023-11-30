import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useInput = (year: number, day: number) => {
  return useQuery({
    queryKey: [`input-${year}-${day}`],
    queryFn: (): Promise<string> => {
      return axios.get(`http://localhost:3000/api/puzzle-input?year=${year}&day=${day}`).then((res) => res.data);
    },
  });
};
