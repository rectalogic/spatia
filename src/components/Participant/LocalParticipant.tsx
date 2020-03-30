import React, { useState, useEffect, useRef } from 'react';
import { LocalParticipant as ILocalParticipant, Track } from 'twilio-video';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { LocalParticipantTracks } from '../ParticipantTracks/ParticipantTracks';
import { ParticipantLocation } from '../Participant/ParticipantLocation';
import { WORLD_SIZE, PORTAL_RADIUS, CAMERA_FOV } from '../../Globals';

const MAXPOS = new THREE.Vector3(WORLD_SIZE / 2, 0, WORLD_SIZE / 2);
const MINPOS = new THREE.Vector3(-WORLD_SIZE / 2, 0, -WORLD_SIZE / 2);

function useCombinedRefs<T>(...refs: (React.MutableRefObject<T> | React.RefCallback<T> | null)[]): React.RefObject<T> {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach(ref => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(targetRef.current);
        } else if (targetRef.current) {
          ref.current = targetRef.current;
        }
      }
    });
  }, [refs]);

  return targetRef;
}

const Camera = React.forwardRef<THREE.PerspectiveCamera>((_props, forwardRef) => {
  const { setDefaultCamera } = useThree();
  const localRef = useRef<THREE.PerspectiveCamera>(null);
  const combinedRefs = useCombinedRefs(forwardRef, localRef);

  // Make the camera known to the system
  useEffect(() => {
    if (combinedRefs.current) {
      setDefaultCamera(combinedRefs.current);
    }
  }, [combinedRefs, setDefaultCamera]);

  return (
    <perspectiveCamera
      ref={combinedRefs}
      fov={CAMERA_FOV}
      near={0.1}
      far={WORLD_SIZE}
      rotation-x={-Math.PI / 24}
      position={[0, 2, 0]}
    >
      <audioListener name="audioListener" />
    </perspectiveCamera>
  );
});

export interface LocalParticipantProps {
  participant: ILocalParticipant;
  controlling: boolean;
  locationRequested: Track.SID;
}

export default function LocalParticipant({ participant, controlling, locationRequested }: LocalParticipantProps) {
  // Randomly position ourself around the portal perimeter
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>(() => {
    const angle = 2 * Math.PI * Math.random();
    const x = 2.5 * PORTAL_RADIUS * Math.cos(angle);
    const z = 2.5 * PORTAL_RADIUS * Math.sin(angle);
    return { x: x, z: z, ry: Math.PI / 2 - angle };
  });
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const participantRef = useRef<THREE.Object3D>(null);
  const tracksRef = useRef<THREE.Object3D>(null);

  useFrame(({ mouse }) => {
    if (controlling) {
      const participant = participantRef.current;
      if (participant) {
        participant.translateZ(-mouse.y / 10);
        // Don't allow walking off the world
        participant.position.clamp(MINPOS, MAXPOS);
        participant.rotation.y += -mouse.x / 100;

        setParticipantLocation({ x: participant.position.x, z: participant.position.z, ry: participant.rotation.y });
      }
    }
  });

  useEffect(() => {
    const tracks = tracksRef.current;
    const camera = cameraRef.current;
    if (!tracks || !camera) {
      return;
    }

    // Position local video near top of camera frustum
    // https://docs.unity3d.com/Manual/FrustumSizeAtDistance.html
    const distance = 2;
    const frustumHeight = distance * Math.tan(CAMERA_FOV * 0.5 * THREE.MathUtils.DEG2RAD);
    tracks.position.set(0, frustumHeight, -distance);
    camera.localToWorld(tracks.position);
    tracks.worldToLocal(tracks.position);
  }, [tracksRef, cameraRef]);

  return (
    <group
      ref={participantRef}
      position={[participantLocation.x, 0, participantLocation.z]}
      rotation-y={participantLocation.ry}
    >
      <Camera ref={cameraRef} />
      <group ref={tracksRef}>
        <LocalParticipantTracks
          participant={participant}
          location={participantLocation}
          locationRequested={locationRequested}
        />
      </group>
    </group>
  );
}
