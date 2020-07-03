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
import {
  WORLD_RADIUS,
  WORLD_SCALE,
  PORTALS,
  PORTAL_RADIUS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  REMOTE_VIDEO_SCALE,
} from '../Globals';

export default class SceneManagerWebGL extends SceneManagerBase {
  constructor() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    super(renderer);
    renderer.shadowMap.enabled = true;
    this.scene.add(new THREE.AmbientLight(0xffad5e, 0.3));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 3 * WORLD_SCALE, -2 * WORLD_SCALE);
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

    const render = () => this.render();
    function loadTexture(loader: THREE.TextureLoader, url: string) {
      const tex = loader.load(url, texture => render());
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(WORLD_RADIUS / (3 * WORLD_SCALE), WORLD_RADIUS / (3 * WORLD_SCALE));
      return tex;
    }
    const loader = new THREE.TextureLoader();
    const groundMaterialParams = {
      envMap: envMap,
      roughnessMap: loadTexture(loader, roughnessStone),
      displacementMap: loadTexture(loader, heightStone),
      normalMap: loadTexture(loader, normalStone),
      map: loadTexture(loader, albedoStone),
    };
    const ground = new THREE.Mesh(
      new THREE.CircleBufferGeometry(WORLD_RADIUS, 36),
      new THREE.MeshStandardMaterial(groundMaterialParams)
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const portalMaterialParms = { envMap: envMap, metalness: 0.3, roughness: 0 };
    for (const { position, color } of PORTALS) {
      const portal = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(PORTAL_RADIUS, PORTAL_RADIUS, WORLD_SCALE / 16, 16),
        new THREE.MeshStandardMaterial({ color: color, ...portalMaterialParms })
      );
      portal.receiveShadow = true;
      portal.position.fromArray(position);
      this.scene.add(portal);
    }

    const walls = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(WORLD_RADIUS, WORLD_RADIUS, WORLD_SCALE, WORLD_SCALE / 16, 1, true),
      new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 'red' })
    );
    walls.position.y = WORLD_SCALE / 2;
    walls.receiveShadow = true;
    walls.castShadow = true;
    this.scene.add(walls);
  }

  createRemoteParticipant() {
    const group = new THREE.Group();
    const depth = WORLD_SCALE / 2;
    const shadowCaster = new THREE.Mesh(
      new THREE.BoxBufferGeometry(REMOTE_VIDEO_SCALE * VIDEO_WIDTH, REMOTE_VIDEO_SCALE * VIDEO_HEIGHT, depth),
      new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
    );
    shadowCaster.position.z = -depth / 2;
    shadowCaster.castShadow = true;
    group.add(shadowCaster);
    return group;
  }
}
