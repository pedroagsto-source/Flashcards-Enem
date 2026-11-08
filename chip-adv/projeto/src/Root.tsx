import { Composition } from 'remotion';
import { ChipAdv } from './ChipAdv';
import { AdVariant, BODY_FRAMES, COLD, HookId } from './AdVariants';
import { TOTAL } from './lib';
import { MotionAd, MOTION_FRAMES, MOTION_FRAMES_ES } from './MotionAd';
import { F1Ad, F1_FRAMES } from './f1/F1Ad';
import { F6Anim, F6_FRAMES, F6_FRAMES_ES } from './f6/F6Anim';
import { F7Ad, F7_FRAMES } from './f7/F7Ad';
import { F8Ad, F8_FRAMES } from './f8/F8Ad';
import { Aula00, AULA00_FRAMES } from './aulas/Aula00';
import { Aula01, AULA01_FRAMES } from './aulas/Aula01';
import { AULAS, TOTAL as TOTAL_AULA } from './aulas/Aulas';

const HOOKS: HookId[] = ['h2', 'h3', 'h4', 'h5'];

export const RemotionRoot = () => (
  <>
    <Composition id="ChipAdv" component={ChipAdv} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad" component={F1Ad} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad-escritorio" component={F1Ad} defaultProps={{ fundo: 'escritorio' as const }} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F6Anim" component={F6Anim} durationInFrames={F6_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F7Ad" component={F7Ad} durationInFrames={F7_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MotionAd" component={MotionAd} durationInFrames={MOTION_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F8Ad" component={F8Ad} durationInFrames={F8_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Aula00" component={Aula00} durationInFrames={AULA00_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Aula01" component={Aula01} durationInFrames={AULA01_FRAMES} fps={30} width={1920} height={1080} />
    {AULAS.map(([id, C, k]) => <Composition key={id} id={id} component={C} durationInFrames={TOTAL_AULA(k)} fps={30} width={1920} height={1080} />)}
    {/* LATAM: versões em espanhol */}
    <Composition id="ChipAdv-es" component={ChipAdv} defaultProps={{ lang: 'es' as const }} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad-es" component={F1Ad} defaultProps={{ lang: 'es' as const }} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad-escritorio-es" component={F1Ad} defaultProps={{ fundo: 'escritorio' as const, lang: 'es' as const }} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F6Anim-es" component={F6Anim} defaultProps={{ lang: 'es' as const }} durationInFrames={F6_FRAMES_ES} fps={30} width={1080} height={1920} />
    <Composition id="F7Ad-es" component={F7Ad} defaultProps={{ lang: 'es' as const }} durationInFrames={F7_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MotionAd-es" component={MotionAd} defaultProps={{ lang: 'es' as const }} durationInFrames={MOTION_FRAMES_ES} fps={30} width={1080} height={1920} />
    {HOOKS.map((h) => (
      <Composition key={h} id={`Ad30-${h}`} component={AdVariant} defaultProps={{ hook: h, body: 'cut30' }}
        durationInFrames={BODY_FRAMES + (h === 'h5' ? COLD : 0)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
