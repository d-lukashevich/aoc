import React from 'react';
import { useRouter } from 'next/router';
import { useInput } from '../../utils';
import styles from './index.module.css';

type Solver = (str: string) => any;

type PuzzleRendererProps = {
  func: Solver;
  first?: Solver;
  second?: Solver;
};

const getHtml = (payload: any) => {
  if (typeof payload === 'string') return payload;
  return JSON.stringify(payload, null, 2) || '';
};

export const PuzzleRenderer = ({ func }: PuzzleRendererProps) => {
  const { route } = useRouter();
  const [, year, day] = route.split('/').filter(Boolean).map(Number);
  const { data } = useInput(year, day);
  return (
    <div className={styles.container}>
      <div className="overflow-auto">
        <pre>{data}</pre>
      </div>
      {data && (
        <pre
          className={styles.result}
          dangerouslySetInnerHTML={{
            __html: data ? getHtml(func(data)) : '',
          }}
        />
      )}
    </div>
  );
};
