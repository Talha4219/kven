// Kven roster — neutral agent avatars.
//
// Both the static portraits (cards / picker) and the in-scene walking sprites are
// now fully custom-drawn from the same per-character recipes in portraitArt.ts:
// the scene sprite reuses the portrait's exact head/face/clothing and adds legs,
// so an agent on the office floor looks identical to its card. The LimeZu base
// sheets are no longer used for the cast. See assets/ATTRIBUTION.md.

import { Texture } from 'pixi.js';
import { paintPortrait, sceneFrameBufs, SCENE_W, SCENE_H } from './portraitArt';

export type OfficeCharacterName =
  | 'aria' | 'rowan' | 'sage' | 'milo' | 'bo'
  | 'iris' | 'noor' | 'caleb' | 'wren' | 'theo'
  | 'mia' | 'finn' | 'ezra' | 'rex' | 'hazel';

export interface CastMember {
  name: OfficeCharacterName;
  displayName: string;
  /** Signature accent color (hex) — used for the in-scene selection glow. */
  shirt: string;
  /** Blurb shown when this character is picked / has no description yet. */
  blurb: string;
}

/** Selectable roster, in display order. */
export const OFFICE_CAST: CastMember[] = [
  { name: 'aria',   displayName: 'Aria',   shirt: '#5a6b8c', blurb: 'Orchestrator' },
  { name: 'rowan',  displayName: 'Rowan',  shirt: '#6fa8dc', blurb: 'Engineer' },
  { name: 'sage',   displayName: 'Sage',   shirt: '#9caf88', blurb: 'Docs & design' },
  { name: 'milo',   displayName: 'Milo',   shirt: '#b89b3e', blurb: 'Code review' },
  { name: 'bo',     displayName: 'Bo',     shirt: '#4a7ab5', blurb: 'Accounting' },
  { name: 'iris',   displayName: 'Iris',   shirt: '#8a86a6', blurb: 'Operations' },
  { name: 'noor',   displayName: 'Noor',   shirt: '#7a4b6b', blurb: 'Data & analytics' },
  { name: 'caleb',  displayName: 'Caleb',  shirt: '#8c5a4b', blurb: 'Support' },
  { name: 'wren',   displayName: 'Wren',   shirt: '#b08bbf', blurb: 'Writing' },
  { name: 'theo',   displayName: 'Theo',   shirt: '#6fae6f', blurb: 'Growth' },
  { name: 'mia',    displayName: 'Mia',    shirt: '#d16ba5', blurb: 'Community' },
  { name: 'finn',   displayName: 'Finn',   shirt: '#3a3a44', blurb: 'Intern' },
  { name: 'ezra',   displayName: 'Ezra',   shirt: '#9a8c5a', blurb: 'People ops' },
  { name: 'rex',    displayName: 'Rex',    shirt: '#6b7a4b', blurb: 'Security' },
  { name: 'hazel',  displayName: 'Hazel',  shirt: '#b5544a', blurb: 'Vendors' },
];

export const CAST_BY_NAME: Record<OfficeCharacterName, CastMember> =
  Object.fromEntries(OFFICE_CAST.map((c) => [c.name, c])) as Record<OfficeCharacterName, CastMember>;

export const DEFAULT_CHARACTER: OfficeCharacterName = 'rowan';

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

// ─── scene frames ────────────────────────────────────────────────────────────
const frameCache = new Map<OfficeCharacterName, Texture[][]>();

function bufToTexture(buf: Uint8ClampedArray): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = SCENE_W; canvas.height = SCENE_H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(SCENE_W, SCENE_H);
  img.data.set(buf);
  ctx.putImageData(img, 0, 0);
  const tex = Texture.from(canvas);
  tex.source.scaleMode = 'nearest';
  return tex;
}

/**
 * Frame grid CharacterSprite expects: 3 rows (down, up, right) × 7 frames
 * [walk1, walk2, walk3, type1, type2, read1, read2]. We provide a front view
 * (down — and reused for the side row, so left/right walkers still show a face)
 * and a back view (up — agents seated facing their desk show their back). The
 * three walk frames are stand / step-left / step-right.
 */
export async function getCastFrames(name: OfficeCharacterName): Promise<Texture[][]> {
  const cached = frameCache.get(name);
  if (cached) return cached;
  const { front, back } = sceneFrameBufs(name);
  const toRow = (bufs: Uint8ClampedArray[]): Texture[] => {
    const [stand, stepL, stepR] = bufs.map(bufToTexture);
    return [stand, stepL, stepR, stand, stand, stand, stand];
  };
  const frontRow = toRow(front);
  const frames: Texture[][] = [frontRow, toRow(back), frontRow]; // down, up, right
  frameCache.set(name, frames);
  return frames;
}

/**
 * Paint a character's static portrait for cards / the picker (delegates to the
 * custom procedural composer in portraitArt.ts).
 */
export async function paintCastPortrait(
  ctx: CanvasRenderingContext2D,
  name: OfficeCharacterName,
  scale = 2,
): Promise<void> {
  paintPortrait(ctx, name, scale);
}
