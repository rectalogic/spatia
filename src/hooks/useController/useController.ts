import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import useAnimationFrame from '../useAnimationFrame/useAnimationFrame';
import useKeyPress from './useKeyPress';

export default function useController<T extends HTMLElement>(): [React.RefObject<T>, THREE.Vector2] {
  const [enabled, setEnabled] = useState(false);
  const [acceleration, setAcceleration] = useState<THREE.Vector2>(new THREE.Vector2());
  const ref = useRef<T>(null);

  const upKeyPressed = useKeyPress(['KeyW', 'ArrowUp']);
  const downKeyPressed = useKeyPress(['KeyS', 'ArrowDown']);
  const leftKeyPressed = useKeyPress(['KeyA', 'ArrowLeft']);
  const rightKeyPressed = useKeyPress(['KeyD', 'ArrowRight']);

  useAnimationFrame(() => {
    if (enabled) {
      setAcceleration(new THREE.Vector2().copy(acceleration));
    }
  }, enabled);

  useEffect(() => {
    const x = leftKeyPressed ? -1 : rightKeyPressed ? 1 : 0;
    const y = downKeyPressed ? -1 : upKeyPressed ? 1 : 0;
    setAcceleration(new THREE.Vector2(x, y));
    setEnabled(!!(x || y));
  }, [upKeyPressed, downKeyPressed, leftKeyPressed, rightKeyPressed]);

  useEffect(() => {
    function computeAcceleration(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setAcceleration(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1
        )
      );
      setEnabled(true);
    }

    function onMoveController(e: MouseEvent) {
      if (enabled) {
        e.stopPropagation();
        computeAcceleration(e);
      }
    }

    function onStartController(e: MouseEvent) {
      e.stopPropagation();
      computeAcceleration(e);
    }

    function onStopController(e: MouseEvent) {
      setEnabled(false);
    }

    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', onStartController);
      element.addEventListener('mousemove', onMoveController);
      element.addEventListener('mouseleave', onStopController);
      element.addEventListener('mouseup', onStopController);

      return () => {
        element.removeEventListener('mousedown', onStartController);
        element.removeEventListener('mousemove', onMoveController);
        element.removeEventListener('mouseleave', onStopController);
        element.removeEventListener('mouseup', onStopController);
      };
    }
  }, [ref, enabled]);

  return [ref, acceleration];
}
