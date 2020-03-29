import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Track } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { ParticipantLocation, positionAroundPortal } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';
import { PORTALS, WORLD_SIZE, WORLD_SCALE } from '../../Globals';
import SceneManager from '../../three/SceneManager';

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

  const sceneManager = useState(new SceneManager())[0];
  const canvasWebGLRef = useRef<HTMLDivElement>(null!);
  const canvasCSS3DRef = useRef<HTMLDivElement>(null!);

  function onComputeLocalParticipantLocation(acceleration: THREE.Vector2) {
    const object = sceneManager.sceneWebGL.getLocalParticipant();
    object.rotation.y += -acceleration.x / 100;
    object.translateZ(-acceleration.y * (WORLD_SCALE / 10));
    // Don't allow walking off the world
    object.position.clamp(MINPOS, MAXPOS);
    const location = { x: object.position.x, z: object.position.z, ry: object.rotation.y };
    sceneManager.updateLocalParticipant(location);
    setLocalParticipantLocation(location);
  }

  useEffect(() => {
    sceneManager.sceneWebGL.setParentElement(canvasWebGLRef.current);
    sceneManager.sceneCSS3D.setParentElement(canvasCSS3DRef.current);
  }, [sceneManager, canvasWebGLRef, canvasCSS3DRef]);

  return (
    <Controller onUpdateLocation={onComputeLocalParticipantLocation}>
      <div ref={canvasWebGLRef} style={{ width: '100%', height: '100%' }} />
      <div ref={canvasCSS3DRef} style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }} />
      {participants.map(participant => (
        <RemoteParticipant
          key={participant.sid}
          sceneManager={sceneManager}
          participant={participant}
          requestLocationBroadcast={setCurrentLocationBroadcastRequested}
        />
      ))}

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
    </Controller>
  );
}
