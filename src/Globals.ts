export const WORLD_SCALE = 256; // 256(9/16)=144
export const VIDEO_WIDTH = WORLD_SCALE;
export const VIDEO_HEIGHT = VIDEO_WIDTH * (9 / 16);
export const REMOTE_VIDEO_SCALE = 2;
export const CAMERA_FOV = 60;
export const WORLD_RADIUS = 24 * WORLD_SCALE;
export const PORTAL_RADIUS = WORLD_SCALE;

interface PortalProps {
  position: [number, number, number];
  color: string;
}
export const PORTALS: PortalProps[] = [
  { position: [0, 0, 0], color: '#555555' }, // Main portal for users entering
  { position: [-15 * WORLD_SCALE, 0, 0], color: '#aa0000' },
  { position: [15 * WORLD_SCALE, 0, 0], color: '#00aa00' },
  { position: [0, 0, -15 * WORLD_SCALE], color: '#0000aa' },
  { position: [0, 0, 15 * WORLD_SCALE], color: '#aa00aa' },
];

export const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
