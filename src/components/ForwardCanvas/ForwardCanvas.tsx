import React from 'react';
import { Canvas } from 'react-three-fiber';
import { ContainerProps } from 'react-three-fiber/targets/shared/web/ResizeContainer';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { VideoContext } from '../../components/VideoProvider';
import { useAppState, StateContext } from '../../state';

export default function ForwardCanvas({ children, ...props }: ContainerProps) {
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
