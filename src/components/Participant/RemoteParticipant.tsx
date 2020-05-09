import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { RemoteParticipantAudioTracks, RemoteParticipantDataTracks } from '../ParticipantTracks/ParticipantTracks';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation, RequestLocationCallback } from './ParticipantLocation';
import { useFrame } from 'react-three-fiber/css3d';
import { WORLD_SCALE } from '../../Globals';

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  videoRef: React.MutableRefObject<HTMLElement | null>;
  requestLocation: RequestLocationCallback;
}

export default function RemoteParticipant({ participant, videoRef, requestLocation }: RemoteParticipantProps) {
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [disableVideo, setDisableVideo] = useState(false);
  const groupRef = useRef<THREE.Object3D>(null!);
  const participantPos4 = new THREE.Vector4();

  const onLocationChange = (location: ParticipantLocation) => setParticipantLocation(location);

  useFrame(({ camera }) => {
    participantPos4.set(participantLocation.x, 0, participantLocation.z, 1);
    participantPos4.applyMatrix4(camera.matrixWorldInverse);
    participantPos4.applyMatrix4(camera.projectionMatrix);
    // Behind camera
    if (participantPos4.w < 0) {
      setDisableVideo(true);
    } else {
      setDisableVideo(false);
    }
  });

  useEffect(() => {
    if (disableVideo || videoRef.current === null) return;
    const element = document.getElementById('video' + participant.sid);
    if (element) {
      const group = groupRef.current;
      // CSS3D reparents, save the current parent
      const parent = element.parentElement;
      const cssObject = new CSS3DObject(element);
      group.add(cssObject);
      return () => {
        group.remove(cssObject);
        // Restore the original parent so reactjs does not get confused
        parent?.appendChild(element);
      };
    }
  }, [disableVideo, participant, videoRef, groupRef]);

  return (
    <group
      ref={groupRef}
      position={[participantLocation.x, 2 * WORLD_SCALE, participantLocation.z]}
      rotation-y={participantLocation.ry}
    >
      <RemoteParticipantAudioTracks participant={participant} />
      <RemoteParticipantDataTracks
        participant={participant}
        onLocationChange={onLocationChange}
        requestLocation={requestLocation}
      />
    </group>
  );
}
