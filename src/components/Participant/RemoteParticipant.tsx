import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { RemoteParticipantAudioTracks, RemoteParticipantDataTracks } from '../ParticipantTracks/ParticipantTracks';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation, RequestLocationBroadcastCallback } from './ParticipantLocation';
import { useThree } from 'react-three-fiber/css3d';
import { WORLD_SCALE } from '../../Globals';

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  videoRef: React.MutableRefObject<HTMLElement | null>;
  requestLocationBroadcast: RequestLocationBroadcastCallback;
}

export default function RemoteParticipant({ participant, videoRef, requestLocationBroadcast }: RemoteParticipantProps) {
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [disableVideo, setDisableVideo] = useState(false);
  const { camera } = useThree();
  const groupRef = useRef<THREE.Object3D>(null!);

  const onLocationChange = (location: ParticipantLocation) => setParticipantLocation(location);

  useEffect(() => {
    function isObjectBehindCamera() {
      const objectPos = new THREE.Vector3(participantLocation.x, 0, participantLocation.z);
      const cameraPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
      const deltaCamObj = objectPos.sub(cameraPos);
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      return deltaCamObj.angleTo(camDir) > Math.PI / 2;
    }
    setDisableVideo(isObjectBehindCamera());
  }, [camera, participantLocation]);

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
      position={[participantLocation.x, WORLD_SCALE, participantLocation.z]}
      rotation-y={participantLocation.ry}
    >
      <RemoteParticipantAudioTracks participant={participant} />
      <RemoteParticipantDataTracks
        participant={participant}
        onLocationChange={onLocationChange}
        requestLocationBroadcast={requestLocationBroadcast}
      />
    </group>
  );
}
