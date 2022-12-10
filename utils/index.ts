import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useInput = (num: number) => {
  return useQuery({
    queryKey: [`input-${num}`],
    queryFn: (): Promise<string> => {
      return axios.get(`/inputs/${num}.txt`).then((res) => res.data);
    },
  });
};
