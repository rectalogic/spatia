import * as THREE from 'three';
import { ResizeObserver } from '@juggle/resize-observer';
import { CAMERA_FOV, WORLD_RADIUS, WORLD_SCALE, VIDEO_HEIGHT } from '../Globals';
import { ParticipantLocation } from '../components/Participant/ParticipantLocation';
import { Participant } from 'twilio-video';

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

interface Renderer {
  render: (scene: THREE.Scene, camera: THREE.Camera) => void;
  setSize: (width: number, height: number) => void;
  domElement: HTMLElement;
}

export default abstract class SceneManagerBase {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  private localParticipant: THREE.Object3D;
  private renderer: Renderer;
  private remoteParticipants: Map<Participant.SID, THREE.Object3D>;
  private resizeObserver: ResizeObserver;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, undefined, 0.1 * WORLD_SCALE, WORLD_RADIUS);
    this.camera.rotation.y = Math.PI;
    this.camera.rotation.x = THREE.MathUtils.degToRad(10);
    this.camera.position.y = WORLD_SCALE;
    this.localParticipant = new THREE.Group();
    this.localParticipant.add(this.camera);
    this.scene.add(this.localParticipant);
    this.remoteParticipants = new Map<Participant.SID, THREE.Object3D>();

    this.resizeObserver = new (window.ResizeObserver || ResizeObserver)(entries => {
      const { width, height } = entries[0].contentRect;
      this.resize(width, height);
    });
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setParentElement(parent: HTMLElement) {
    this.resizeObserver.disconnect();
    this.resizeObserver.observe(parent);
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
      participant.position.set(location.x, VIDEO_HEIGHT, location.z);
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
    this.render();
    return participant;
  }
  protected abstract createRemoteParticipant(): THREE.Object3D;

  removeRemoteParticipant(sid: Participant.SID) {
    const participant = this.remoteParticipants.get(sid);
    if (participant) {
      this.remoteParticipants.delete(sid);
      this.scene.remove(participant);
    }
    this.render();
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
