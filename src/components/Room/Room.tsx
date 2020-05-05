import React, { useState, useRef } from 'react';
import { Canvas as CanvasGL } from 'react-three-fiber';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import World from '../World/World';
import { Track } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { ParticipantLocation } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';
import Camera from '../Camera/Camera';
import ForwardCanvasCSS from '../ForwardCanvasCSS/ForwardCanvasCSS';
import { RemoteParticipantVideoTracks } from '../ParticipantTracks/ParticipantTracks';

export default function Room() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const videoRef = useRef<HTMLDivElement | null>(null);

  return (
    <Controller setLocalParticipantLocation={setLocalParticipantLocation}>
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

      <ForwardCanvasCSS>
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
          <div id={'video' + participant.sid} key={participant.sid}>
            <ParticipantInfo participant={participant}>
              <RemoteParticipantVideoTracks participant={participant} />
            </ParticipantInfo>
          </div>
        ))}
      </div>
    </Controller>
  );
}
