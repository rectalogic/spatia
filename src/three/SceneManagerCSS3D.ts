import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import SceneManagerBase from './SceneManagerBase';

export default class SceneManagerCSS3D extends SceneManagerBase {
  listener: THREE.AudioListener;

  constructor() {
    super(new CSS3DRenderer());
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
  }

  createRemoteParticipant() {
    return new THREE.Group();
  }
}
