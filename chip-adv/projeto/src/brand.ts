import '@fontsource/anton';
import '@fontsource/bebas-neue';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/caveat/700.css';
import { Easing } from 'remotion';

export const brand = {
  bg: '#0B0B0F', ink: '#F5F3EE', muted: '#9A9AA5',
  accent: '#D8FF3C', accent2: '#FF5A1F', glass: 'rgba(255,255,255,0.10)',
  teal: '#5EEAD4', violet: '#7C3AED', pink: '#EC4899',
};
export const font = {
  display: 'Anton, sans-serif', bebas: '"Bebas Neue", sans-serif', ui: 'Inter, sans-serif',
  serif: '"Instrument Serif", serif', mag: '"Playfair Display", serif', hand: 'Caveat, cursive',
};
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.in(Easing.cubic),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};
export const springIn = { damping: 14, stiffness: 160, mass: 0.6 };
