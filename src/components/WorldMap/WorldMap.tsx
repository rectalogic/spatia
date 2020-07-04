import React from 'react';
import { VIDEO_HEIGHT, WORLD_RADIUS, PORTALS, WORLD_SCALE } from '../../Globals';

export const MAP_SCALE = 3;

interface WorldMapProps {
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}
export default function WorldMap({ onClick, children }: WorldMapProps) {
  return (
    <svg
      width={VIDEO_HEIGHT + 'px'}
      height={VIDEO_HEIGHT + 'px'}
      viewBox={`${-WORLD_RADIUS} ${-WORLD_RADIUS} ${2 * WORLD_RADIUS} ${2 * WORLD_RADIUS}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle onClick={onClick} cx="0" cy="0" r={WORLD_RADIUS} fill="black" opacity="0.5" />
      {PORTALS.map(portal => (
        <circle
          key={portal.color.toString()}
          cx={portal.position[0]}
          cy={portal.position[2]}
          r={WORLD_SCALE * MAP_SCALE}
          fill={portal.color}
        />
      ))}
      {children}
    </svg>
  );
}
