// ===== Site color palettes (gold + another color) =====
// To choose the colors of the website, change DEFAULT_PALETTE to one of the ids below.
// The colors themselves are in styles/palettes.css
import { IS_DEMO } from './api';

export const DEFAULT_PALETTE = 'ivory';

export const palettes = [
  { id: 'ivory',    ar: 'عاجي وذهبي',      en: 'Ivory & Gold',     swatch: ['#FFFFFF', '#D4AA5A'] },
  { id: 'emerald',  ar: 'زمردي وذهبي',     en: 'Emerald & Gold',   swatch: ['#1F4D45', '#D4AA5A'] },
  { id: 'navy',     ar: 'كحلي وذهبي',      en: 'Navy & Gold',      swatch: ['#1C2541', '#D4AA5A'] },
  { id: 'burgundy', ar: 'عنابي وذهبي',     en: 'Burgundy & Gold',  swatch: ['#6B1E2E', '#D4AA5A'] },
  { id: 'onyx',     ar: 'أسود وذهبي',      en: 'Onyx & Gold',      swatch: ['#161616', '#D4AA5A'] },
  { id: 'rose',     ar: 'وردي وذهبي',      en: 'Rose & Gold',      swatch: ['#C98F98', '#D4AA5A'] },
];

// the palette picker shows only in the online preview and while developing
export const SHOW_PICKER = IS_DEMO || import.meta.env.DEV;

export function startPalette() {
  if (SHOW_PICKER) {
    try { return localStorage.getItem('tuana_palette') || DEFAULT_PALETTE; } catch {}
  }
  return DEFAULT_PALETTE;
}

export function applyPalette(id) {
  document.documentElement.dataset.palette = id;
  try { localStorage.setItem('tuana_palette', id); } catch {}
}
