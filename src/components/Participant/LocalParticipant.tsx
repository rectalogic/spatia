import React, { useEffect, useRef } from 'react';
import { LocalParticipant as ILocalParticipant, Track } from 'twilio-video';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { LocalParticipantTracks } from '../ParticipantTracks/ParticipantTracks';
import { ParticipantLocation } from '../Participant/ParticipantLocation';
import { WORLD_SIZE, CAMERA_FOV } from '../../Globals';

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
  participantLocation: ParticipantLocation;
  locationRequested: Track.SID;
}

export default function LocalParticipant({
  participant,
  participantLocation,
  locationRequested,
}: LocalParticipantProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const participantRef = useRef<THREE.Object3D>(null);
  const tracksRef = useRef<THREE.Object3D>(null);

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
