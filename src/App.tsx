import { RecoilRoot } from 'recoil';
import { Stats } from './ScoreBoard';
import { Field } from './Field';
import './styles/App.css';

export default function App(): JSX.Element {
  return (
    <RecoilRoot>
      <div className="App">
        <Field />
        <Stats />
      </div>
    </RecoilRoot>
  );
}
