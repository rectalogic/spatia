import React, { useEffect, useMemo, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { LocalAudioTrack as ILocalAudioTrack, RemoteAudioTrack as IRemoteAudioTrack, Track } from 'twilio-video';
import { AUDIO_REF_DISTANCE } from '../../Globals';

interface LocalAudioTrackProps {
  track: ILocalAudioTrack;
}

export function LocalAudioTrack({ track }: LocalAudioTrackProps) {
  const audio = useMemo(() => document.createElement('audio'), []);

  useEffect(() => {
    track.attach(audio);
    return () => {
      track.detach(audio);
    };
  }, [track, audio]);
  return null;
}

interface RemoteAudioTrack3DProps {
  track: IRemoteAudioTrack;
  priority: Track.Priority;
}

export function RemoteAudioTrack3D({ track, priority }: RemoteAudioTrack3DProps) {
  const ref = useRef<THREE.PositionalAudio>(null);
  const { camera } = useThree();
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

  const listener = camera.getObjectByName('audioListener') as THREE.AudioListener;
  return <positionalAudio ref={ref} args={[listener]} />;
}
