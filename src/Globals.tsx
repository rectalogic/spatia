export const WORLD_SCALE = 256; // 256(9/16)=144
export const VIDEO_WIDTH = WORLD_SCALE;
export const CAMERA_FOV = 75;
export const AUDIO_REF_DISTANCE = WORLD_SCALE;
export const AUDIO_MAX_DISTANCE = 20 * WORLD_SCALE;
export const VIDEO_MAX_DISTANCE = 15 * WORLD_SCALE;
export const WORLD_SIZE = 128 * WORLD_SCALE;
export const PORTAL_RADIUS = WORLD_SCALE;

export type RenderType = 'css3d' | 'webgl';

interface PortalProps {
  position: [number, number, number];
  color: number;
}
export const PORTALS: PortalProps[] = [
  { position: [0, 0, 0], color: 0x555555 }, // Main portal for users entering
  { position: [-10 * WORLD_SCALE, 0, 0], color: 0xaa0000 },
  { position: [10 * WORLD_SCALE, 0, 0], color: 0x00aa00 },
  { position: [0, 0, -10 * WORLD_SCALE], color: 0x0000aa },
  { position: [0, 0, 10 * WORLD_SCALE], color: 0xaaaa00 },
];
