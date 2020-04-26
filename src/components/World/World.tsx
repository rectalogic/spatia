import React, { useRef, useEffect } from 'react';
import { useThree, ReactThreeFiber } from 'react-three-fiber';
import * as THREE from 'three';
import { WORLD_SIZE, PORTAL_RADIUS, PORTALS } from '../../Globals';
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

interface GroundProps {
  envMap: THREE.CubeTexture;
}

function Ground({ envMap }: GroundProps) {
  const ref = useRef<THREE.PlaneBufferGeometry>(null);

  const loader = new THREE.TextureLoader();
  function loadTexture(url: string) {
    const tex = loader.load(url);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(WORLD_SIZE / 6, WORLD_SIZE / 6);
    return tex;
  }
  const albedoMap = useRef(loadTexture(albedoStone));
  const heightMap = useRef(loadTexture(heightStone));
  const normalMap = useRef(loadTexture(normalStone));
  const roughnessMap = useRef(loadTexture(roughnessStone));

  useEffect(() => {
    ref.current!.rotateX(-Math.PI / 2);
  }, [ref]);

  return (
    <mesh>
      <planeBufferGeometry ref={ref} attach="geometry" args={[WORLD_SIZE, WORLD_SIZE]} />
      <meshStandardMaterial
        attach="material"
        envMap={envMap}
        roughnessMap={roughnessMap.current}
        displacementMap={heightMap.current}
        normalMap={normalMap.current}
        map={albedoMap.current}
      />
    </mesh>
  );
}

interface PortalProps {
  position: ReactThreeFiber.Vector3;
  color: ReactThreeFiber.Color;
  envMap: THREE.CubeTexture;
}

function Portal({ position, color, envMap }: PortalProps) {
  return (
    <mesh position={position}>
      <cylinderBufferGeometry attach="geometry" args={[PORTAL_RADIUS, PORTAL_RADIUS, 1, 16]} />
      <meshStandardMaterial attach="material" color={color} metalness={1} roughness={0} envMap={envMap} />
    </mesh>
  );
}

interface WorldProps {
  children: React.ReactNode;
}

export default function World({ children }: WorldProps) {
  const { scene } = useThree();
  const urls = [pxCube, nxCube, pyCube, nyCube, pzCube, nzCube];
  const cubeTexture = new THREE.CubeTextureLoader().load(urls, texture => (scene.background = texture));
  return (
    <>
      <ambientLight args={[0xffad5e, 0.3]} />
      <directionalLight args={[0xffffff, 1]} position={[0, 1, -2]} />
      {children}
      {PORTALS.map(({ position, color }) => (
        <Portal key={position.toString()} position={position} color={color} envMap={cubeTexture} />
      ))}
      <Ground envMap={cubeTexture} />
    </>
  );
}
