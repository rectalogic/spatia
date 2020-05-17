import { Track } from 'twilio-video';
import { PORTAL_RADIUS } from '../../Globals';

export interface ParticipantLocation {
  x: number;
  z: number;
  ry: number;
}

export const SendLocationTrigger = new Float64Array(1);

export function marshalLocation(location: ParticipantLocation) {
  return new Float64Array([location.x, location.z, location.ry]);
}

export function unmarshalLocation(data: Float64Array) {
  return { x: data[0], z: data[1], ry: data[2] };
}

export type LocationChangeCallback = (location: ParticipantLocation) => void;
export type RequestLocationBroadcastCallback = (sid: Track.SID) => void;

export function positionAroundPortal(center: [number, number, number], angle: number) {
  const x = center[0] + 2 * PORTAL_RADIUS * Math.cos(angle);
  const z = center[2] + 2 * PORTAL_RADIUS * Math.sin(angle);
  return { x: x, z: z, ry: -Math.PI / 2 - angle };
}

export function rotationToPortalAngle(ry: number) {
  return -Math.PI / 2 - ry;
}
