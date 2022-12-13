import { useInput } from '../../utils';
import styles from './index.module.css';

type Solver = (str: string) => any;

type PuzzleRendererProps = {
  func: Solver;
  first?: Solver;
  second?: Solver;
  day: number;
};

const getHtml = (payload: any) => {
  if (typeof payload === 'string') return payload;
  return JSON.stringify(payload, null, 2) || '';
};

export const PuzzleRenderer = ({ func, day }: PuzzleRendererProps) => {
  const { data } = useInput(day);
  return (
    <div className={styles.container}>
      <div className="overflow-auto">
        <pre>{data}</pre>
      </div>
      {data && (
        <pre
          className={styles.result}
          dangerouslySetInnerHTML={{
            __html: getHtml(func(data)),
          }}
        />
      )}
    </div>
  );
};
