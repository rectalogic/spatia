import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import SceneManagerBase from './SceneManagerBase';

export default class SceneManagerCSS3D extends SceneManagerBase {
  listener: THREE.AudioListener;

  constructor() {
    super(new CSS3DRenderer());
    // Once WebAudio supports it, set sink on the AudioContext destination
    // const { activeSinkId } = useAppState();
    // https://github.com/WebAudio/web-audio-api-v2/issues/10
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
  }

  createRemoteParticipant() {
    return new THREE.Group();
  }

  resumeAudio() {
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume();
    }
  }
}
