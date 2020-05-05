import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree as useThreeGL, useUpdate as useUpdateGL } from 'react-three-fiber';
import { useThree as useThreeCSS, useUpdate as useUpdateCSS } from 'react-three-fiber/css3d';
import { CAMERA_FOV, WORLD_SIZE, WORLD_SCALE } from '../../Globals';

const RenderInfo = {
  css3d: {
    useThree: useThreeCSS,
    useUpdate: useUpdateCSS,
  },
  webgl: {
    useThree: useThreeGL,
    useUpdate: useUpdateGL,
  },
};

interface CameraProps {
  renderer: 'css3d' | 'webgl';
  hasListener?: boolean;
}
export default function Camera({ renderer, hasListener }: CameraProps) {
  const { setDefaultCamera, size } = RenderInfo[renderer]['useThree']();
  const ref = RenderInfo[renderer]['useUpdate']<THREE.PerspectiveCamera>(
    cam => {
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
    },
    [size, renderer]
  );

  useEffect(() => {
    setDefaultCamera(ref.current);
  }, [ref, setDefaultCamera]);

  return (
    <perspectiveCamera
      ref={ref}
      fov={CAMERA_FOV}
      near={0.1 * WORLD_SCALE}
      far={WORLD_SIZE}
      rotation-x={-Math.PI / 24}
      position={[0, 2 * WORLD_SCALE, 0]}
    >
      {hasListener ? <audioListener name="audioListener" /> : null}
    </perspectiveCamera>
  );
}
