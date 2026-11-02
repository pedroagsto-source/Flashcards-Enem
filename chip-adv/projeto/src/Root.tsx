import { Composition } from 'remotion';
import { ChipAdv } from './ChipAdv';
import { TOTAL } from './lib';
export const RemotionRoot = () => (
  <Composition id="ChipAdv" component={ChipAdv} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
