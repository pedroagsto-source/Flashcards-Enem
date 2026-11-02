import { Composition } from 'remotion';
import { ChipAdv } from './ChipAdv';
import { AdVariant, BODY_FRAMES, COLD, HookId } from './AdVariants';
import { TOTAL } from './lib';

const HOOKS: HookId[] = ['h2', 'h3', 'h4', 'h5'];

export const RemotionRoot = () => (
  <>
    <Composition id="ChipAdv" component={ChipAdv} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    {HOOKS.map((h) => (
      <Composition key={h} id={`Ad30-${h}`} component={AdVariant} defaultProps={{ hook: h, body: 'cut30' }}
        durationInFrames={BODY_FRAMES + (h === 'h5' ? COLD : 0)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
