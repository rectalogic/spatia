import * as THREE from 'three';

import pxCube from './Textures/SkyBox/px.png';
import nxCube from './Textures/SkyBox/nx.png';
import pyCube from './Textures/SkyBox/py.png';
import nyCube from './Textures/SkyBox/ny.png';
import pzCube from './Textures/SkyBox/pz.png';
import nzCube from './Textures/SkyBox/nz.png';
import albedoStone from './Textures/Ground/stone_albedo.png';
import heightStone from './Textures/Ground/stone_height.png';
import normalStone from './Textures/Ground/stone_normal.png';
import roughnessStone from './Textures/Ground/stone_roughness.png';
import SceneManagerBase from './SceneManagerBase';
import { WORLD_SIZE, WORLD_SCALE, PORTALS, PORTAL_RADIUS, VIDEO_WIDTH } from '../Globals';

export default class SceneManagerWebGL extends SceneManagerBase {
  constructor() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    super(renderer);
    renderer.shadowMap.enabled = true;
    this.scene.add(new THREE.AmbientLight(0xffad5e, 0.3));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, WORLD_SCALE, -2 * WORLD_SCALE);
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5 * WORLD_SCALE;
    directionalLight.shadow.camera.far = 500 * WORLD_SCALE;
    directionalLight.shadow.camera.left = -5 * WORLD_SCALE;
    directionalLight.shadow.camera.right = 5 * WORLD_SCALE;
    directionalLight.shadow.camera.top = 5 * WORLD_SCALE;
    directionalLight.shadow.camera.bottom = -5 * WORLD_SCALE;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const envMap = new THREE.CubeTextureLoader().load([pxCube, nxCube, pyCube, nyCube, pzCube, nzCube], texture => {
      this.scene.background = texture;
      this.render();
    });

    function loadTexture(loader: THREE.TextureLoader, url: string, render: () => void) {
      const tex = loader.load(url, texture => render());
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(WORLD_SIZE / (6 * WORLD_SCALE), WORLD_SIZE / (6 * WORLD_SCALE));
      return tex;
    }
    const loader = new THREE.TextureLoader();
    const groundMaterialParams = {
      envMap: envMap,
      roughnessMap: loadTexture(loader, roughnessStone, this.render),
      displacementMap: loadTexture(loader, heightStone, this.render),
      normalMap: loadTexture(loader, normalStone, this.render),
      map: loadTexture(loader, albedoStone, this.render),
    };
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(WORLD_SIZE, WORLD_SIZE),
      new THREE.MeshStandardMaterial(groundMaterialParams)
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const portalMaterialParms = { envMap: envMap, metalness: 1, roughness: 0 };
    for (const { position, color } of PORTALS) {
      const portal = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(PORTAL_RADIUS, PORTAL_RADIUS, WORLD_SCALE / 16, 16),
        new THREE.MeshStandardMaterial({ color: color, ...portalMaterialParms })
      );
      portal.receiveShadow = true;
      portal.position.fromArray(position);
      this.scene.add(portal);
    }
  }

  createRemoteParticipant() {
    const shadowCaster = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2 * VIDEO_WIDTH, (2 * VIDEO_WIDTH * 9) / 16),
      new THREE.MeshBasicMaterial({ opacity: 0 })
    );
    shadowCaster.castShadow = true;
    return shadowCaster;
  }
}
