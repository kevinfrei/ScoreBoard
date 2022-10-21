import { Junction } from './Junction';

export function Field(): JSX.Element {
  const theJunctions: JSX.Element[] = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      theJunctions.push(<Junction key={`${i}:${j}`} row={i} col={j} />);
    }
  }
  return <div className="field">{theJunctions}</div>;
}
