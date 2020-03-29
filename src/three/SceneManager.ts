import SceneManagerWebGL from './SceneManagerWebGL';
import SceneManagerCSS3D from './SceneManagerCSS3D';
import { ParticipantLocation } from '../components/Participant/ParticipantLocation';
import { Participant } from 'twilio-video';

export default class SceneManager {
  sceneWebGL: SceneManagerWebGL;
  sceneCSS3D: SceneManagerCSS3D;

  constructor() {
    this.sceneWebGL = new SceneManagerWebGL();
    this.sceneCSS3D = new SceneManagerCSS3D();
  }

  updateLocalParticipant(location: ParticipantLocation) {
    this.sceneWebGL.updateLocalParticipant(location);
    this.sceneCSS3D.updateLocalParticipant(location);
  }

  updateRemoteParticipant(sid: Participant.SID, location: ParticipantLocation) {
    this.sceneWebGL.updateRemoteParticipant(sid, location);
    this.sceneCSS3D.updateRemoteParticipant(sid, location);
  }
}
