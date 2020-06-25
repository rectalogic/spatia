import React from 'react';
import * as THREE from 'three';
import { Participant } from 'twilio-video';
import { ParticipantLocation } from './ParticipantLocation';
import { WORLD_SCALE } from '../../Globals';

const HALF_SIZE = WORLD_SCALE * 5;
const SIZE = HALF_SIZE * 2;
const STROKE_WIDTH = HALF_SIZE / 5;

interface MapLocationProps {
  participant: Participant;
  location: ParticipantLocation;
  color: string;
}
export default function MapLocation({ participant, location, color }: MapLocationProps) {
  return (
    <g
      transform={`rotate(${THREE.MathUtils.radToDeg(-location.ry)} ${location.x} ${location.z}) translate(${location.x -
        HALF_SIZE}, ${location.z - HALF_SIZE / 2})`}
    >
      <rect x="0" y="0" width={SIZE} height={HALF_SIZE} fill={color}>
        <title>{participant.identity}</title>
      </rect>
      <line
        x1="0"
        y1={HALF_SIZE + STROKE_WIDTH / 2}
        x2={SIZE}
        y2={HALF_SIZE + STROKE_WIDTH / 2}
        stroke-width={STROKE_WIDTH}
        stroke="red"
      />
    </g>
  );
}
