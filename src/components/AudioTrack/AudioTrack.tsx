import { useEffect } from 'react';
import * as THREE from 'three';
import { RemoteAudioTrack as IRemoteAudioTrack } from 'twilio-video';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';
import { WORLD_SCALE } from '../../Globals';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';

interface RemoteAudioTrackProps {
  track: IRemoteAudioTrack;
  sceneManager: SceneManagerCSS3D;
  participant3D: THREE.Object3D | null;
}

export default function RemoteAudioTrack({ track, sceneManager, participant3D }: RemoteAudioTrackProps) {
  const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    if (mediaStreamTrack && participant3D) {
      const mediaStream = new MediaStream([mediaStreamTrack.clone()]);
      const positionalAudio = new THREE.PositionalAudio(sceneManager.listener);
      // https://medium.com/@kfarr/understanding-web-audio-api-positional-audio-distance-models-for-webxr-e77998afcdff
      positionalAudio.setRefDistance(3 * WORLD_SCALE);
      positionalAudio.setRolloffFactor(3);
      positionalAudio.setDirectionalCone(360, 0, 0);
      positionalAudio.setMediaStreamSource(mediaStream);
      participant3D.add(positionalAudio);
      return () => {
        mediaStream.removeTrack(mediaStreamTrack);
        participant3D.remove(positionalAudio);
      };
    }
  }, [mediaStreamTrack, participant3D, sceneManager]);

  return null;
}
