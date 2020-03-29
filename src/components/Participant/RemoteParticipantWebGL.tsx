import SceneManagerBase from '../../three/SceneManagerBase';
import { RemoteParticipant } from 'twilio-video';
import { useEffect } from 'react';
import { ParticipantLocation } from './ParticipantLocation';

interface RemoteParticipantWebGLProps {
  sceneManager: SceneManagerBase;
  participant: RemoteParticipant;
  location: ParticipantLocation;
}
export default function RemoteParticipantWebGL({ sceneManager, participant, location }: RemoteParticipantWebGLProps) {
  useEffect(() => {
    sceneManager.addRemoteParticipant(participant.sid);
    return () => {
      sceneManager.removeRemoteParticipant(participant.sid);
    };
  }, [sceneManager, participant]);

  useEffect(() => {
    sceneManager.updateRemoteParticipant(participant.sid, location);
  }, [sceneManager, participant, location]);

  return null;
}
