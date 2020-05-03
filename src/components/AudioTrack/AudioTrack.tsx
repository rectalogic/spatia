import React, { useEffect, useMemo, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { RemoteAudioTrack as IRemoteAudioTrack, Track } from 'twilio-video';
import { AUDIO_REF_DISTANCE } from '../../Globals';
import { useAppState } from '../../state';

interface RemoteAudioTrack3DProps {
  track: IRemoteAudioTrack;
  priority: Track.Priority;
}

export default function RemoteAudioTrack3D({ track, priority }: RemoteAudioTrack3DProps) {
  const ref = useRef<THREE.PositionalAudio>(null);
  const { camera } = useThree();
  const { activeSinkId } = useAppState();
  const audio = useMemo(() => document.createElement('audio'), []);

  useEffect(() => {
    track.setPriority(priority);
    track.attach(audio);
    const sound = ref.current!;
    sound.setRefDistance(AUDIO_REF_DISTANCE);
    sound.setMediaElementSource(audio);
    return () => {
      track.detach(audio);
      // Passing `null` to setPriority will set the track's priority to that which it was published with.
      track.setPriority(null);
    };
  }, [ref, track, priority, audio]);

  useEffect(() => {
    audio.setSinkId?.(activeSinkId);
  }, [audio, activeSinkId]);

  const listener = camera.getObjectByName('audioListener') as THREE.AudioListener;
  return <positionalAudio ref={ref} args={[listener]} />;
}
