import React, { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas as CanvasGL } from 'react-three-fiber';
import { Canvas as CanvasCSS } from 'react-three-fiber/css3d';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import World, { ParticipantShadowCaster } from '../World/World';
import { Track, Participant } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { ParticipantLocation, positionAroundPortal } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';
import Camera from '../Camera/Camera';
import {
  RemoteParticipantVideoTracks,
  RemoteParticipantAudioTracks,
  RemoteParticipantDataTracks,
} from '../ParticipantTracks/ParticipantTracks';
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
  const [remoteParticipantLocations, setRemoteParticipantLocations] = useState<
    Map<Participant.SID, ParticipantLocation>
  >(new Map<Participant.SID, ParticipantLocation>());
  const [attachParticipantAudio, setAttachParticipantAudio] = useState<Map<Participant.SID, boolean>>(
    new Map<Participant.SID, boolean>()
  );
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const localParticipantRef = useRef<THREE.Object3D>(null);
  const audioListenerRef = useRef<THREE.AudioListener>(null);

  function onComputeLocalParticipantLocation(acceleration: THREE.Vector2) {
    const object = localParticipantRef.current;
    if (object) {
      object.rotation.y += -acceleration.x / 100;
      object.translateZ(-acceleration.y * (WORLD_SCALE / 10));
      // Don't allow walking off the world
      object.position.clamp(MINPOS, MAXPOS);
      setLocalParticipantLocation({ x: object.position.x, z: object.position.z, ry: object.rotation.y });
    }
  }

  const onUpdateRemoteParticipantLocations = useCallback((sid: Participant.SID, location: ParticipantLocation) => {
    //XXX this doesn't remove old sids
    setRemoteParticipantLocations(locations => new Map(locations.set(sid, location)));
  }, []);

  const onUpdateRemoteParticipantAttachAudio = useCallback((sid: Participant.SID, attach: boolean) => {
    //XXX this doesn't remove old sids
    setAttachParticipantAudio(attachments => new Map(attachments.set(sid, attach)));
  }, []);

  return (
    <Controller onUpdateLocation={onComputeLocalParticipantLocation}>
      <CanvasGL invalidateFrameloop={true} shadowMap>
        <World>
          <group
            position={[localParticipantLocation.x, 0, localParticipantLocation.z]}
            rotation-y={localParticipantLocation.ry}
          >
            <Camera renderer="webgl" />
          </group>
          {participants.map(participant => {
            const location = remoteParticipantLocations.get(participant.sid);
            return <ParticipantShadowCaster key={participant.sid} location={location || { x: 0, z: 0, ry: 0 }} />;
          })}
        </World>
      </CanvasGL>

      <CanvasCSS invalidateFrameloop={true} style={{ position: 'absolute', top: '0' }}>
        <group
          ref={localParticipantRef}
          position={[localParticipantLocation.x, 0, localParticipantLocation.z]}
          rotation-y={localParticipantLocation.ry}
        >
          <Camera renderer="css3d" ref={audioListenerRef} hasListener />
        </group>
        {participants.map(participant => {
          const location = remoteParticipantLocations.get(participant.sid);
          return (
            <RemoteParticipant
              key={participant.sid}
              participant={participant}
              participantLocation={location || { x: 0, z: 0, ry: 0 }}
              audioListenerRef={audioListenerRef}
              mediaRef={mediaRef}
              setAttachAudio={onUpdateRemoteParticipantAttachAudio}
            />
          );
        })}
      </CanvasCSS>

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

      <div ref={mediaRef}>
        {participants.map(participant => (
          // Stable parent div of the video 'id' div, since we reparent in the CSS3D canvas
          <div key={participant.sid}>
            <div>
              <div id={'video' + participant.sid}>
                <div style={{ transform: 'rotateY(180deg) scale(2, 2)' }}>
                  <ParticipantInfo participant={participant}>
                    <RemoteParticipantVideoTracks participant={participant} />
                  </ParticipantInfo>
                </div>
              </div>
            </div>
            <div id={'audio' + participant.sid}>
              <RemoteParticipantAudioTracks
                participant={participant}
                attachAudio={attachParticipantAudio.get(participant.sid) || false}
              />
            </div>
            <RemoteParticipantDataTracks
              participant={participant}
              onLocationChange={location => onUpdateRemoteParticipantLocations(participant.sid, location)}
              requestLocationBroadcast={setCurrentLocationBroadcastRequested}
            />
          </div>
        ))}
      </div>
    </Controller>
  );
}
