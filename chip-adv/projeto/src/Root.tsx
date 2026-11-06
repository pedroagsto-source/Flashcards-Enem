import { Composition } from 'remotion';
import { ChipAdv } from './ChipAdv';
import { AdVariant, BODY_FRAMES, COLD, HookId } from './AdVariants';
import { TOTAL } from './lib';
import { MotionAd, MOTION_FRAMES, MOTION_FRAMES_ES } from './MotionAd';
import { F1Ad, F1_FRAMES } from './f1/F1Ad';
import { F6Anim, F6_FRAMES, F6_FRAMES_ES } from './f6/F6Anim';
import { F7Ad, F7_FRAMES } from './f7/F7Ad';
import { AuxAd, auxFrames } from './auxilio/AuxAd';
import { BODY_IDS, ESTILOS, HOOK_IDS } from './auxilio/plan';

const HOOKS: HookId[] = ['h2', 'h3', 'h4', 'h5'];

export const RemotionRoot = () => (
  <>
    <Composition id="ChipAdv" component={ChipAdv} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad" component={F1Ad} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F1Ad-escritorio" component={F1Ad} defaultProps={{ fundo: 'escritorio' as const }} durationInFrames={F1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F6Anim" component={F6Anim} durationInFrames={F6_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="F7Ad" component={F7Ad} durationInFrames={F7_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MotionAd" component={MotionAd} durationInFrames={MOTION_FRAMES} fps={30} width={1080} height={1920} />
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
    {/* Auxílio-acidente: teste criativo 4 hooks × 3 bodies × 3 estilos */}
    {ESTILOS.flatMap((estilo) => HOOK_IDS.flatMap((hook) => BODY_IDS.map((body) => (
      <Composition key={`${estilo}${hook}${body}`} id={`Aux-${estilo}-${hook}${body}`} component={AuxAd} defaultProps={{ hook, body, estilo }}
        durationInFrames={auxFrames(hook, body)} fps={30} width={1080} height={1920} />
    ))))}
  </>
);
