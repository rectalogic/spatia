import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas as CanvasGL } from 'react-three-fiber';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import World from '../World/World';
import { Track } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { ParticipantLocation, positionAroundPortal } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';
import Camera from '../Camera/Camera';
import ForwardCanvasCSS from '../ForwardCanvasCSS/ForwardCanvasCSS';
import { RemoteParticipantVideoTracks } from '../ParticipantTracks/ParticipantTracks';
import { PORTALS, WORLD_SIZE, WORLD_SCALE } from '../../Globals';

const MAXPOS = new THREE.Vector3(WORLD_SIZE / 2, 0, WORLD_SIZE / 2);
const MINPOS = new THREE.Vector3(-WORLD_SIZE / 2, 0, -WORLD_SIZE / 2);

export default function Room() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const initialLocation = positionAroundPortal(PORTALS[0]['position']);
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>(initialLocation);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const objectRef = useRef<THREE.Object3D>(
    (() => {
      const object = new THREE.Object3D();
      object.position.set(initialLocation.x, 0, initialLocation.z);
      object.rotation.set(0, initialLocation.ry, 0);
      return object;
    })()
  );

  function onUpdateLocation(acceleration: THREE.Vector2) {
    const object = objectRef.current;
    object.translateZ(-acceleration.y * (WORLD_SCALE / 10));
    // Don't allow walking off the world
    object.position.clamp(MINPOS, MAXPOS);
    object.rotation.y += -acceleration.x / 100;
    setLocalParticipantLocation({ x: object.position.x, z: object.position.z, ry: object.rotation.y });
  }

  return (
    <Controller onUpdateLocation={onUpdateLocation}>
      <CanvasGL>
        <World>
          <group
            position={[localParticipantLocation.x, 0, localParticipantLocation.z]}
            rotation-y={localParticipantLocation.ry}
          >
            <Camera renderer="webgl" />
          </group>
        </World>
      </CanvasGL>

      <ForwardCanvasCSS style={{ position: 'absolute', top: '0' }}>
        <group
          position={[localParticipantLocation.x, 0, localParticipantLocation.z]}
          rotation-y={localParticipantLocation.ry}
        >
          <Camera renderer="css3d" hasListener />
        </group>
        {participants.map(participant => {
          return (
            <RemoteParticipant
              key={participant.sid}
              participant={participant}
              videoRef={videoRef}
              requestLocation={setLocationRequested}
            />
          );
        })}
      </ForwardCanvasCSS>

      <div style={{ position: 'absolute', top: '0', left: '50%' }}>
        <div style={{ position: 'relative', left: '-50%' }}>
          <ParticipantInfo participant={localParticipant}>
            <LocalParticipant
              participant={localParticipant}
              participantLocation={localParticipantLocation}
              locationRequested={locationRequested}
            />
          </ParticipantInfo>
        </div>
      </div>

      <div ref={videoRef}>
        {participants.map(participant => (
          // Stable parent div since we reparent in the CSS3D canvas
          <div key={participant.sid}>
            <div id={'video' + participant.sid}>
              <ParticipantInfo participant={participant}>
                <RemoteParticipantVideoTracks participant={participant} />
              </ParticipantInfo>
            </div>
          </div>
        ))}
      </div>
    </Controller>
  );
}
