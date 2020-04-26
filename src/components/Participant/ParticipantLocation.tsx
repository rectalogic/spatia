import { Track } from 'twilio-video';
import { PORTAL_RADIUS } from '../../Globals';

export interface ParticipantLocation {
  x: number;
  z: number;
  ry: number;
}

export type LocationCallback = (location: ParticipantLocation) => void;
export type RequestLocationCallback = (sid: Track.SID) => void;

export function positionAroundPortal(position: [number, number, number]) {
  const angle = 2 * Math.PI * Math.random();
  const x = position[0] + 2.5 * PORTAL_RADIUS * Math.cos(angle);
  const z = position[1] + 2.5 * PORTAL_RADIUS * Math.sin(angle);
  return { x: x, z: z, ry: Math.PI / 2 - angle };
}
