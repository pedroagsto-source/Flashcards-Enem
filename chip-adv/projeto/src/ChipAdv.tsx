import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { chunks, E, S, TOTAL, wordFrame } from './lib';
import { camera } from './camera';
import { Captions } from './components/Captions';
import { Grade } from './components/Grade';
import { Sfx } from './components/Sfx';
import { E05Zoom } from './effects/E05Zoom';
import { E17Vidro } from './effects/E17Vidro';
import { Antes } from './effects/Antes';
import { E09Corte } from './effects/E09Corte';
import { E11Revelacao, E11Front } from './effects/E11Revelacao';
import { MapaCard } from './effects/MapaCard';
import { E07Checklist } from './effects/E07Checklist';
import { Ordens } from './effects/Ordens';
import { E16Capa } from './effects/E16Capa';
import { E12Cta } from './effects/E12Cta';
import { Lang, LangCtx } from './lang';

/** Vídeo base: cada trecho do EDL em sequência, com a "câmera" (zoom, posição, filtro) aplicada. */
const Base = () => {
  const g = useCurrentFrame();
  const cam = camera(g);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`,
          transformOrigin: `${cam.ox}% ${cam.oy}%`,
          filter: cam.filter,
          borderRadius: cam.radius,
          overflow: 'hidden',
        }}
      >
        {chunks.map((c) => (
          <Sequence key={c.i} from={c.start} durationInFrames={c.dur} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(`${c.clip}.mp4`)} trimBefore={c.from} style={{ width: '100%', height: '100%' }} />
            </AbsoluteFill>
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Faixa de música com ducking leve; sobe na transição antes/depois. */
const Music = () => (
  <Audio
    src={staticFile('music/bed.wav')}
    volume={(f) => (f >= S(5) + 25 && f < S(7) ? 0.34 : f >= S(18) ? 0.24 : 0.17)}
  />
);

export const ChipAdv = ({ lang = 'pt' }: { lang?: Lang }) => (
  <LangCtx.Provider value={lang}><AbsoluteFill style={{ backgroundColor: '#000' }}>
    {/* atrás do vídeo base */}
    <Sequence from={S(7)} durationInFrames={E(7) - S(7)}><E11Revelacao /></Sequence>

    <Base />

    {/* efeitos por cima */}
    <Sequence from={0} durationInFrames={E(1)}><E05Zoom /></Sequence>
    <Sequence from={S(3)} durationInFrames={E(3) - S(3)}><E17Vidro g0={S(3)} /></Sequence>
    <Sequence from={S(4)} durationInFrames={E(5) - S(4)}><Antes /></Sequence>
    <Sequence from={E(5) - 10} durationInFrames={34}><E09Corte /></Sequence>
    <Sequence from={S(7)} durationInFrames={E(7) - S(7)}><E11Front /></Sequence>
    <Sequence from={wordFrame(8, 'mapa') - 6} durationInFrames={E(8) - wordFrame(8, 'mapa') + 6}><MapaCard /></Sequence>
    <Sequence from={S(9)} durationInFrames={E(11) - S(9)}><E07Checklist g0={S(9)} /></Sequence>
    <Sequence from={wordFrame(12, 'ordens') - 8} durationInFrames={E(15) - wordFrame(12, 'ordens') + 8}><Ordens /></Sequence>
    <Sequence from={S(16)} durationInFrames={E(17) - S(16)}><E16Capa g0={S(16)} /></Sequence>
    <Sequence from={S(18)} durationInFrames={TOTAL - S(18)}><E12Cta g0={S(18)} /></Sequence>

    <Captions />
    <Grade />
    <Music />
    <Sfx />
  </AbsoluteFill></LangCtx.Provider>
);
