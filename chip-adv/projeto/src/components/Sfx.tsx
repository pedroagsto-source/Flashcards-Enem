import { Audio, Sequence, staticFile } from 'remotion';
import { T } from '../timing';
import { S } from '../lib';

type Cue = [frame: number, name: string, vol: number];

const cues: Cue[] = [
  [T.z1, 'impact', 0.55], [T.z1, 'flash', 0.3],
  [T.z2, 'impact', 0.6], [T.z2, 'flash', 0.3],
  [S(2), 'whoosh', 0.22],
  [T.vidro, 'whoosh', 0.35], [T.vidro + 6, 'shimmer', 0.22],
  [T.rec, 'click', 0.4],
  [T.corte - 30, 'riser', 0.32], [T.corte - 10, 'whoosh', 0.4], [T.corte, 'impact', 0.6], [T.corte, 'flash', 0.35],
  [S(7), 'whoosh', 0.3],
  ...T.tasks.map((f): Cue => [f, 'pop', 0.3]),
  [T.mapa - 6, 'whoosh', 0.22], [T.mapa, 'pop', 0.3],
  [S(9), 'whoosh', 0.25],
  ...T.checks.map((f): Cue => [f, 'pop', 0.35]),
  [T.checks[3] + 16, 'shimmer', 0.25],
  ...T.ordens.map((f): Cue => [f, 'pop', 0.28]),
  [T.capa, 'impact', 0.5], [T.capa, 'flash', 0.25], [T.capa + 20, 'shimmer', 0.2],
  [T.cta, 'whoosh', 0.35], [T.click, 'click', 0.6], [T.doc, 'pop', 0.3], [T.magica, 'shimmer', 0.32],
];

export const Sfx = () => (
  <>
    {cues.map(([f, n, v], i) => (
      <Sequence key={i} from={Math.max(0, f)} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);
