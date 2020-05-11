import React, { useEffect, useState } from 'react';
import { useThree, ReactThreeFiber, invalidate } from 'react-three-fiber';
import * as THREE from 'three';
import { WORLD_SIZE, PORTAL_RADIUS, PORTALS, WORLD_SCALE, VIDEO_WIDTH } from '../../Globals';
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
import { ParticipantLocation } from '../Participant/ParticipantLocation';

interface GroundProps {
  envMap: THREE.CubeTexture | null;
}

function Ground({ envMap }: GroundProps) {
  const [albedoMap, setAlbedoMap] = useState<THREE.Texture | null>();
  const [heightMap, setHeightMap] = useState<THREE.Texture | null>();
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>();
  const [roughnessMap, setRoughnessMap] = useState<THREE.Texture | null>();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    function loadTexture(url: string) {
      const tex = loader.load(url);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(WORLD_SIZE / (6 * WORLD_SCALE), WORLD_SIZE / (6 * WORLD_SCALE));
      return tex;
    }
    setAlbedoMap(loadTexture(albedoStone));
    setHeightMap(loadTexture(heightStone));
    setNormalMap(loadTexture(normalStone));
    setRoughnessMap(loadTexture(roughnessStone));
    invalidate();
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[WORLD_SIZE, WORLD_SIZE]} />
      <meshStandardMaterial
        attach="material"
        envMap={envMap}
        roughnessMap={roughnessMap}
        displacementMap={heightMap}
        normalMap={normalMap}
        map={albedoMap}
      />
    </mesh>
  );
}

interface PortalProps {
  position: ReactThreeFiber.Vector3;
  color: ReactThreeFiber.Color;
  envMap: THREE.CubeTexture | null;
}

function Portal({ position, color, envMap }: PortalProps) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderBufferGeometry attach="geometry" args={[PORTAL_RADIUS, PORTAL_RADIUS, WORLD_SCALE / 16, 16]} />
      <meshStandardMaterial attach="material" color={color} metalness={1} roughness={0} envMap={envMap} />
    </mesh>
  );
}

interface ParticipantShadowCasterProps {
  location: ParticipantLocation;
}
export function ParticipantShadowCaster({ location }: ParticipantShadowCasterProps) {
  return (
    <mesh position={[location.x, WORLD_SCALE, location.z]} rotation-y={location.ry} castShadow>
      <planeBufferGeometry attach="geometry" args={[2 * VIDEO_WIDTH, (2 * VIDEO_WIDTH * 9) / 16]} />
      <meshBasicMaterial attach="material" opacity={0} />
    </mesh>
  );
}

interface WorldProps {
  children: React.ReactNode;
}
export default function World({ children }: WorldProps) {
  const { scene } = useThree();
  const [cubeTexture, setCubeTexture] = useState<THREE.CubeTexture | null>(null);
  useEffect(() => {
    const urls = [pxCube, nxCube, pyCube, nyCube, pzCube, nzCube];
    setCubeTexture(
      new THREE.CubeTextureLoader().load(urls, texture => {
        scene.background = texture;
        invalidate();
      })
    );
  }, [scene]);

  return (
    <>
      <ambientLight args={[0xffad5e, 0.3]} />
      <directionalLight
        args={[0xffffff, 1]}
        position={[0, WORLD_SCALE, -2 * WORLD_SCALE]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5 * WORLD_SCALE}
        shadow-camera-far={500 * WORLD_SCALE}
        shadow-camera-left={-5 * WORLD_SCALE}
        shadow-camera-right={5 * WORLD_SCALE}
        shadow-camera-top={5 * WORLD_SCALE}
        shadow-camera-bottom={-5 * WORLD_SCALE}
        castShadow
      />
      {children}
      {PORTALS.map(({ position, color }) => (
        <Portal key={position.toString()} position={position} color={color} envMap={cubeTexture} />
      ))}
      <Ground envMap={cubeTexture} />
    </>
  );
}
