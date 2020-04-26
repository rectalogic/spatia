import React, { useState } from 'react';
import { RemoteParticipantTracks } from '../ParticipantTracks/ParticipantTracks';
import { RemoteParticipant as IRemoteParticipant, Track } from 'twilio-video';
import { ParticipantLocation, RequestLocationCallback } from './ParticipantLocation';
import { ReactThreeFiber, PointerEvent, useFrame } from 'react-three-fiber';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import Dom3D from '../Dom3D/Dom3D';
import * as THREE from 'three';
import { VIDEO_MAX_DISTANCE, AUDIO_MAX_DISTANCE } from '../../Globals';

interface DirectionProps {
  color: ReactThreeFiber.Color;
  position: ReactThreeFiber.Vector3;
  scale: ReactThreeFiber.Vector3;
}

function Direction({ color, position, scale }: DirectionProps) {
  return (
    <group position={position} scale={scale} rotation-x={-Math.PI / 2}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderBufferGeometry attach="geometry" args={[0.1, 0.06, 1.5, 8]} />
        <meshStandardMaterial metalness={1} roughness={0} attach="material" color={color} />
      </mesh>
      <mesh position={[0, 1.625, 0]}>
        <coneBufferGeometry attach="geometry" args={[0.2, 0.3, 8]} />
        <meshStandardMaterial metalness={1} roughness={0} attach="material" color={color} />
      </mesh>
    </group>
  );
}

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  requestLocation: RequestLocationCallback;
}

export default function RemoteParticipant({ participant, requestLocation }: RemoteParticipantProps) {
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [videoPriority, setVideoPriority] = useState<Track.Priority | null>('standard');
  const [audioPriority, setAudioPriority] = useState<Track.Priority | null>('standard');
  const [infoScale, setInfoScale] = useState(1);
  const cameraPos = new THREE.Vector3();
  const participantPos = new THREE.Vector3();
  const participantPos4 = new THREE.Vector4();

  const onLocationChange = (location: ParticipantLocation) => setParticipantLocation(location);

  useFrame(({ camera }) => {
    camera.getWorldPosition(cameraPos);
    participantPos.set(participantLocation.x, 0, participantLocation.z);
    const distance = participantPos.distanceTo(cameraPos);

    let newVideoPriority: Track.Priority | null = 'standard';
    let newAudioPriority: Track.Priority | null = 'standard';

    if (distance > VIDEO_MAX_DISTANCE) {
      newVideoPriority = null;
    } else if (distance > VIDEO_MAX_DISTANCE / 2) {
      newVideoPriority = 'low';
    }

    if (distance > AUDIO_MAX_DISTANCE) {
      newAudioPriority = null;
    } else if (distance > AUDIO_MAX_DISTANCE / 2) {
      newAudioPriority = 'low';
    }

    if (newVideoPriority === 'standard') {
      participantPos4.set(participantLocation.x, 0, participantLocation.z, 1);
      participantPos4.applyMatrix4(camera.matrixWorldInverse);
      participantPos4.applyMatrix4(camera.projectionMatrix);
      // Behind camera
      if (participantPos4.w < 0) {
        newVideoPriority = null;
      }
    }

    setVideoPriority(newVideoPriority);
    setAudioPriority(newAudioPriority);
    const min = 2;
    if (distance <= min) {
      setInfoScale(1);
    } else {
      setInfoScale(THREE.MathUtils.clamp(1 - distance / (VIDEO_MAX_DISTANCE - min), 0.5, 1));
    }
  });

  function onPointerOver(e: PointerEvent) {
    const group = e.eventObject;
    if (group) {
      group.position.y += 0.5;
      group.scale.set(group.scale.x * 2, group.scale.y * 2, 1);
    }
  }

  function onPointerOut(e: PointerEvent) {
    const group = e.eventObject;
    if (group) {
      group.position.y -= 0.5;
      group.scale.set(group.scale.x / 2, group.scale.y / 2, 1);
    }
  }

  return (
    <group position={[participantLocation.x, 1, participantLocation.z]} rotation-y={participantLocation.ry}>
      <group scale={[2, 2, 1]} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <Dom3D scale={infoScale} position={[0, 0.5, 0]}>
          <ParticipantInfo participant={participant} />
        </Dom3D>
        <RemoteParticipantTracks
          participant={participant}
          videoPriority={videoPriority}
          audioPriority={audioPriority}
          onLocationChange={onLocationChange}
          requestLocation={requestLocation}
        />
      </group>
      <Direction position={[0, -0.5, 0]} scale={[0.5, 0.5, 0.5]} color={0xaa0000} />
    </group>
  );
}
