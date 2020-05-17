import SceneManagerBase from '../../three/SceneManagerBase';
import { RemoteParticipant } from 'twilio-video';
import { useEffect } from 'react';

interface RemoteParticipantWebGLProps {
  sceneManager: SceneManagerBase;
  participant: RemoteParticipant;
}
export default function RemoteParticipantWebGL({ sceneManager, participant }: RemoteParticipantWebGLProps) {
  useEffect(() => {
    sceneManager.addRemoteParticipant(participant.sid);
    return () => {
      sceneManager.removeRemoteParticipant(participant.sid);
    };
  }, [sceneManager, participant]);

  return null;
}
