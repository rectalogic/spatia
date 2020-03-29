import React, { useState } from 'react';
import * as THREE from 'three';
import useAnimationFrame from '../../hooks/useAnimationFrame/useAnimationFrame';
import { styled } from '@material-ui/core/styles';

const CanvasContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
}));

interface ControllerProps {
  onUpdateLocation: (acceleration: THREE.Vector2) => void;
  children: React.ReactNode;
}
export default function Controller({ onUpdateLocation, children }: ControllerProps) {
  const [acceleration, setAcceleration] = useState<THREE.Vector2 | null>(null);

  function computeAcceleration(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setAcceleration(
      new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, (-(e.clientY - rect.top) / rect.height) * 2 + 1)
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
      onUpdateLocation(acceleration);
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
