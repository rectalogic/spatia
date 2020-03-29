import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RemoteAudioTrack as IRemoteAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';
import { AUDIO_REF_DISTANCE } from '../../Globals';

interface RemoteAudioTrackProps {
  track: IRemoteAudioTrack;
  sceneManager: SceneManagerCSS3D;
  participant3D: THREE.Object3D | null;
}

export default function RemoteAudioTrack({ track, sceneManager, participant3D }: RemoteAudioTrackProps) {
  const { activeSinkId } = useAppState();
  const audioRef = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    if (participant3D) {
      const audio = audioRef.current;
      const positionalAudio = new THREE.PositionalAudio(sceneManager.listener);
      positionalAudio.setRefDistance(AUDIO_REF_DISTANCE);
      positionalAudio.setDirectionalCone(360, 0, 0);
      positionalAudio.setMediaElementSource(audio);
      participant3D.add(positionalAudio);
      track.attach(audio);
      return () => {
        track.detach(audio);
        participant3D.remove(positionalAudio);
      };
    }
  }, [audioRef, track, participant3D, sceneManager]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.setSinkId?.(activeSinkId);
  }, [audioRef, activeSinkId]);

  return <audio ref={audioRef} />;
}
