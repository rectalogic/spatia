import { useEffect } from 'react';
import * as THREE from 'three';
import { RemoteAudioTrack as IRemoteAudioTrack } from 'twilio-video';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';
import { WORLD_SCALE } from '../../Globals';

interface RemoteAudioTrackProps {
  track: IRemoteAudioTrack;
  sceneManager: SceneManagerCSS3D;
  participant3D: THREE.Object3D | null;
}

export default function RemoteAudioTrack({ track, sceneManager, participant3D }: RemoteAudioTrackProps) {
  useEffect(() => {
    if (participant3D) {
      const mediaStream = new MediaStream([track.mediaStreamTrack.clone()]);
      const positionalAudio = new THREE.PositionalAudio(sceneManager.listener);
      // https://medium.com/@kfarr/understanding-web-audio-api-positional-audio-distance-models-for-webxr-e77998afcdff
      positionalAudio.setRefDistance(3 * WORLD_SCALE);
      positionalAudio.setRolloffFactor(3);
      positionalAudio.setDirectionalCone(360, 0, 0);
      positionalAudio.setMediaStreamSource(mediaStream);
      participant3D.add(positionalAudio);
      return () => {
        mediaStream.removeTrack(track.mediaStreamTrack);
        participant3D.remove(positionalAudio);
      };
    }
  }, [track, participant3D, sceneManager]);

  return null;
}
