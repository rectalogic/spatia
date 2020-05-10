import React, { useEffect, forwardRef } from 'react';
import * as THREE from 'three';
import { useThree as useThreeGL, useUpdate as useUpdateGL } from 'react-three-fiber';
import { useThree as useThreeCSS, useUpdate as useUpdateCSS } from 'react-three-fiber/css3d';
import { CAMERA_FOV, WORLD_SIZE, WORLD_SCALE, RenderType } from '../../Globals';

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
  renderer: RenderType;
  hasListener?: boolean;
}
const Camera = forwardRef<THREE.AudioListener, CameraProps>(({ renderer, hasListener }, ref) => {
  const { setDefaultCamera, size } = RenderInfo[renderer]['useThree']();
  const cameraRef = RenderInfo[renderer]['useUpdate']<THREE.PerspectiveCamera>(
    cam => {
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
    },
    [size, renderer]
  );

  useEffect(() => {
    setDefaultCamera(cameraRef.current);
  }, [cameraRef, setDefaultCamera]);

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={CAMERA_FOV}
      near={0.1 * WORLD_SCALE}
      far={WORLD_SIZE}
      rotation-x={-Math.PI / 24}
      position={[0, 2 * WORLD_SCALE, 0]}
    >
      {hasListener ? <audioListener ref={ref} /> : null}
    </perspectiveCamera>
  );
});

export default Camera;
