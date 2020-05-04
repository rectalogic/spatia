import React from 'react';
import { Canvas } from 'react-three-fiber/css3d';
import { ContainerProps } from 'react-three-fiber/targets/shared/web/ResizeContainer';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { VideoContext } from '../../components/VideoProvider';
import { useAppState, StateContext } from '../../state';

// We have to forward VideoContext into the Canvas - it has a different render-root
// https://github.com/react-spring/react-three-fiber/issues/262
export default function ForwardCanvasCSS({ children, ...props }: ContainerProps) {
  const videoContext = useVideoContext();
  const appState = useAppState();
  return (
    <Canvas {...props}>
      <VideoContext.Provider value={videoContext}>
        <StateContext.Provider value={appState}>{children}</StateContext.Provider>
      </VideoContext.Provider>
    </Canvas>
  );
}
