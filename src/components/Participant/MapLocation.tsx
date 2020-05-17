import React from 'react';
import { Participant } from 'twilio-video';
import { ParticipantLocation } from './ParticipantLocation';
import { WORLD_SCALE } from '../../Globals';

const HALF_SIZE = WORLD_SCALE * 5;

interface MapLocationProps {
  participant: Participant;
  location: ParticipantLocation;
  color: string;
}
export default function MapLocation({ participant, location, color }: MapLocationProps) {
  return (
    <rect
      x={location.x - HALF_SIZE}
      y={location.z - HALF_SIZE}
      width={HALF_SIZE * 2}
      height={HALF_SIZE * 2}
      fill={color}
    >
      <title>{participant.identity}</title>
    </rect>
  );
}
