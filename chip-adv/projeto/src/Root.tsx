import { Composition } from 'remotion';
import { ChipAdv } from './ChipAdv';
import { AdVariant, BODY_FRAMES, COLD, HookId } from './AdVariants';
import { TOTAL } from './lib';
import { MotionAd, MOTION_FRAMES } from './MotionAd';
import { F1Ad, F1_FRAMES } from './f1/F1Ad';

const HOOKS: HookId[] = ['h2', 'h3', 'h4', 'h5'];

export const RemotionRoot = () => (
  <>
    <Composition id="ChipAdv" component={ChipAdv} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad" component={F1Ad} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MotionAd" component={MotionAd} durationInFrames={MOTION_FRAMES} fps={30} width={1080} height={1920} />
    {HOOKS.map((h) => (
      <Composition key={h} id={`Ad30-${h}`} component={AdVariant} defaultProps={{ hook: h, body: 'cut30' }}
        durationInFrames={BODY_FRAMES + (h === 'h5' ? COLD : 0)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
