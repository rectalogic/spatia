import { Track } from 'twilio-video';

export interface ParticipantLocation {
  x: number;
  z: number;
  ry: number;
}

export type LocationCallback = (location: ParticipantLocation) => void;
export type RequestLocationCallback = (sid: Track.SID) => void;
