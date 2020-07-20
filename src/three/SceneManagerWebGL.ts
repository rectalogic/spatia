import * as THREE from 'three';

import pxCube from './Textures/SkyBox/px.png';
import nxCube from './Textures/SkyBox/nx.png';
import pyCube from './Textures/SkyBox/py.png';
import nyCube from './Textures/SkyBox/ny.png';
import pzCube from './Textures/SkyBox/pz.png';
import nzCube from './Textures/SkyBox/nz.png';
import diffuseStone from './Textures/Ground/cobblestone_diffuse.jpg';
import displacementStone from './Textures/Ground/cobblestone_displacement.jpg';
import normalStone from './Textures/Ground/cobblestone_normal.jpg';
import roughnessStone from './Textures/Ground/cobblestone_roughness.jpg';
import aoStone from './Textures/Ground/cobblestone_ao.jpg';
import diffuseWall from './Textures/Wall/wall_diffuse.jpg';
import displacementWall from './Textures/Wall/wall_displacement.jpg';
import normalWall from './Textures/Wall/wall_normal.jpg';
import roughnessWall from './Textures/Wall/wall_roughness.jpg';
import aoWall from './Textures/Wall/wall_ao.jpg';
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
    directionalLight.position.set(0, 20 * WORLD_SCALE, -20 * WORLD_SCALE);
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 15 * WORLD_SCALE;
    directionalLight.shadow.camera.far = 50 * WORLD_SCALE;
    directionalLight.shadow.camera.left = -(WORLD_RADIUS + 20 * WORLD_SCALE);
    directionalLight.shadow.camera.right = WORLD_RADIUS + 20 * WORLD_SCALE;
    directionalLight.shadow.camera.top = WORLD_RADIUS + 20 * WORLD_SCALE;
    directionalLight.shadow.camera.bottom = -(WORLD_RADIUS + 20 * WORLD_SCALE);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const envMap = new THREE.CubeTextureLoader().load([pxCube, nxCube, pyCube, nyCube, pzCube, nzCube], texture => {
      this.scene.background = texture;
      this.render();
    });

    const render = () => this.render();
    function loadTexture(loader: THREE.TextureLoader, url: string, repeatX: number, repeatY: number) {
      const tex = loader.load(url, texture => render());
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.anisotropy = 4;
      return tex;
    }
    const loader = new THREE.TextureLoader();
    const repeatGround = WORLD_RADIUS / (3 * WORLD_SCALE);
    const groundMaterialParams = {
      envMap: envMap,
      roughnessMap: loadTexture(loader, roughnessStone, repeatGround, repeatGround),
      displacementMap: loadTexture(loader, displacementStone, repeatGround, repeatGround),
      displacementScale: 2,
      normalMap: loadTexture(loader, normalStone, repeatGround, repeatGround),
      aoMap: loadTexture(loader, aoStone, repeatGround, repeatGround),
      map: loadTexture(loader, diffuseStone, repeatGround, repeatGround),
    };
    const circleGeometry = new THREE.CircleBufferGeometry(WORLD_RADIUS, 36);
    circleGeometry.attributes.uv2 = circleGeometry.attributes.uv;
    const ground = new THREE.Mesh(circleGeometry, new THREE.MeshStandardMaterial(groundMaterialParams));
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

    const repeatWallY = 1;
    const repeatWallX = 128;
    const wallMaterialParams = {
      envMap: envMap,
      roughnessMap: loadTexture(loader, roughnessWall, repeatWallX, repeatWallY),
      displacementMap: loadTexture(loader, displacementWall, repeatWallX, repeatWallY),
      bumpMap: loadTexture(loader, normalWall, repeatWallX, repeatWallY),
      aoMap: loadTexture(loader, aoWall, repeatWallX, repeatWallY),
      map: loadTexture(loader, diffuseWall, repeatWallX, repeatWallY),
    };
    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      WORLD_RADIUS,
      WORLD_RADIUS,
      WORLD_SCALE,
      WORLD_SCALE / 16,
      1,
      true
    );
    cylinderGeometry.attributes.uv2 = cylinderGeometry.attributes.uv;
    const walls = new THREE.Mesh(
      cylinderGeometry,
      new THREE.MeshStandardMaterial({ side: THREE.BackSide, ...wallMaterialParams })
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
