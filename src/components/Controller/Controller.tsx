import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useAnimationFrame from '../../hooks/useAnimationFrame/useAnimationFrame';
import { ParticipantLocation, positionAroundPortal } from '../Participant/ParticipantLocation';
import { PORTALS, WORLD_SIZE } from '../../Globals';
import { styled } from '@material-ui/core/styles';

const MAXPOS = new THREE.Vector3(WORLD_SIZE / 2, 0, WORLD_SIZE / 2);
const MINPOS = new THREE.Vector3(-WORLD_SIZE / 2, 0, -WORLD_SIZE / 2);

const CanvasContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
}));

interface ControllerProps {
  setLocalParticipantLocation: (localParticipantLocation: ParticipantLocation) => void;
  children: React.ReactNode;
}
export default function Controller({ setLocalParticipantLocation, children }: ControllerProps) {
  const objectRef = useRef(new THREE.Object3D());
  const [acceleration, setAcceleration] = useState<THREE.Vector2 | null>(null);

  useEffect(() => {
    // Initially randomly position ourself around the portal perimeter
    const location = positionAroundPortal(PORTALS[0]['position']);
    const object = objectRef.current;
    object.position.set(location.x, 0, location.z);
    object.rotation.set(0, location.ry, 0);
    setLocalParticipantLocation(location);
  }, [setLocalParticipantLocation]);

  function computeAcceleration(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    setAcceleration(
      new THREE.Vector2((e.clientX / target.clientWidth) * 2 - 1, -(e.clientY / target.clientHeight) * 2 + 1)
    );
  }

  function onStartController(e: React.MouseEvent) {
    e.stopPropagation();
    computeAcceleration(e);
  }

  function onMoveController(e: React.MouseEvent) {
    if (acceleration) {
      e.stopPropagation();
      computeAcceleration(e);
    }
  }

  function onStopController(e: React.MouseEvent) {
    setAcceleration(null);
  }

  useAnimationFrame(() => {
    if (acceleration) {
      const object = objectRef.current;
      object.translateZ(-acceleration.y / 10);
      // Don't allow walking off the world
      object.position.clamp(MINPOS, MAXPOS);
      object.rotation.y += -acceleration.x / 100;

      setLocalParticipantLocation({ x: object.position.x, z: object.position.z, ry: object.rotation.y });
    }
  }, acceleration != null);

  return (
    <CanvasContainer
      onMouseDown={e => onStartController(e)}
      onMouseMove={e => onMoveController(e)}
      onMouseLeave={e => onStopController(e)}
      onMouseUp={e => onStopController(e)}
    >
      {children}
    </CanvasContainer>
  );
}
