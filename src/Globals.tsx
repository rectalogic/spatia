export const CAMERA_FOV = 75;
export const AUDIO_REF_DISTANCE = 1;
export const AUDIO_MAX_DISTANCE = 20;
export const VIDEO_MAX_DISTANCE = 15;
export const WORLD_SIZE = 128;
export const PORTAL_RADIUS = 1;

interface PortalProps {
  position: [number, number, number];
  color: number;
}
export const PORTALS: PortalProps[] = [
  { position: [0, 0, 0], color: 0x555555 }, // Main portal for users entering
  { position: [-10, 0, 0], color: 0xaa0000 },
  { position: [10, 0, 0], color: 0x00aa00 },
  { position: [0, 0, -10], color: 0x0000aa },
  { position: [0, 0, 10], color: 0xaaaa00 },
];
