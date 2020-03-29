import * as THREE from 'three';
import { ResizeObserver } from '@juggle/resize-observer';
import { CAMERA_FOV, WORLD_SIZE, WORLD_SCALE } from '../Globals';
import { ParticipantLocation } from '../components/Participant/ParticipantLocation';
import { Participant } from 'twilio-video';

interface Renderer {
  render: (scene: THREE.Scene, camera: THREE.Camera) => void;
  domElement: HTMLElement;
}

export default abstract class SceneManagerBase {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  private localParticipant: THREE.Object3D;
  private renderer: Renderer;
  private remoteParticipants: Map<Participant.SID, THREE.Object3D>;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, undefined, 0.1 * WORLD_SCALE, WORLD_SIZE);
    this.camera.rotation.x = -Math.PI / 24;
    this.camera.position.y = 2 * WORLD_SCALE;
    this.localParticipant = new THREE.Group();
    this.localParticipant.add(this.camera);
    this.scene.add(this.localParticipant);
    this.remoteParticipants = new Map<Participant.SID, THREE.Object3D>();

    const resizeObserver = new ResizeObserver(entries => {
      const { inlineSize: width, blockSize: height } = entries[0].contentBoxSize[0];
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
    resizeObserver.observe(renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setParentElement(parent: HTMLElement) {
    parent.appendChild(this.renderer.domElement);
  }

  updateLocalParticipant(location: ParticipantLocation) {
    this.localParticipant.position.set(location.x, 0, location.z);
    this.localParticipant.rotation.y = location.ry;
    this.render();
  }

  getLocalParticipant() {
    return this.localParticipant;
  }

  updateRemoteParticipant(sid: Participant.SID, location: ParticipantLocation) {
    const participant = this.remoteParticipants.get(sid);
    if (participant) {
      participant.position.set(location.x, 0, location.z);
      participant.rotation.y = location.ry;
      this.render();
    }
  }

  getRemoteParticipant(sid: Participant.SID) {
    return this.remoteParticipants.get(sid);
  }

  addRemoteParticipant(sid: Participant.SID) {
    const participant = this.createRemoteParticipant();
    this.remoteParticipants.set(sid, participant);
    this.scene.add(participant);
    return participant;
  }
  protected abstract createRemoteParticipant(): THREE.Object3D;

  removeRemoteParticipant(sid: Participant.SID) {
    const participant = this.remoteParticipants.get(sid);
    if (participant) {
      this.remoteParticipants.delete(sid);
      this.scene.remove(participant);
    }
    return null;
  }

  isLocationBehindCamera(location: ParticipantLocation) {
    const objectPos = new THREE.Vector3(location.x, 0, location.z);
    const cameraPos = new THREE.Vector3().setFromMatrixPosition(this.camera.matrixWorld);
    const deltaCamObj = objectPos.sub(cameraPos);
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    return deltaCamObj.angleTo(camDir) > Math.PI / 2;
  }
}
