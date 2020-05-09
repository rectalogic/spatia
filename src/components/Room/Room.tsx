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
import ForwardCanvas from '../ForwardCanvas/ForwardCanvas';
import { RemoteParticipantVideoTracks } from '../ParticipantTracks/ParticipantTracks';
import { PORTALS, WORLD_SIZE, WORLD_SCALE } from '../../Globals';

const MAXPOS = new THREE.Vector3(WORLD_SIZE / 2, 0, WORLD_SIZE / 2);
const MINPOS = new THREE.Vector3(-WORLD_SIZE / 2, 0, -WORLD_SIZE / 2);

export default function Room() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [currentLocationBroadcastRequested, setCurrentLocationBroadcastRequested] = useState<Track.SID>('');
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>(
    positionAroundPortal(PORTALS[0]['position'])
  );
  const videoRef = useRef<HTMLDivElement | null>(null);
  const localParticipantRef = useRef<THREE.Object3D>(null);

  function onUpdateLocation(acceleration: THREE.Vector2) {
    const object = localParticipantRef.current;
    if (object) {
      object.rotation.y += -acceleration.x / 100;
      object.translateZ(-acceleration.y * (WORLD_SCALE / 10));
      // Don't allow walking off the world
      object.position.clamp(MINPOS, MAXPOS);
      setLocalParticipantLocation({ x: object.position.x, z: object.position.z, ry: object.rotation.y });
    }
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

      <ForwardCanvas renderer="css3d" style={{ position: 'absolute', top: '0' }}>
        <group
          ref={localParticipantRef}
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
              requestLocationBroadcast={setCurrentLocationBroadcastRequested}
            />
          );
        })}
      </ForwardCanvas>

      <div style={{ position: 'absolute', top: '0', left: '50%' }}>
        <div style={{ position: 'relative', left: '-50%' }}>
          <ParticipantInfo participant={localParticipant}>
            <LocalParticipant
              participant={localParticipant}
              participantLocation={localParticipantLocation}
              triggerLocationBroadcast={currentLocationBroadcastRequested}
            />
          </ParticipantInfo>
        </div>
      </div>

      <div ref={videoRef}>
        {participants.map(participant => (
          // Stable parent div since we reparent in the CSS3D canvas
          <div key={participant.sid}>
            <div id={'video' + participant.sid}>
              <div style={{ transform: 'rotateY(180deg) scale(2, 2)' }}>
                <ParticipantInfo participant={participant}>
                  <RemoteParticipantVideoTracks participant={participant} />
                </ParticipantInfo>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Controller>
  );
}
