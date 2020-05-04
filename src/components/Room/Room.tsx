import React, { useState } from 'react';
import { Canvas as CanvasGL } from 'react-three-fiber';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import World from '../World/World';
import { Track, Participant } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { ParticipantLocation } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';
import Camera from '../Camera/Camera';
import DomPortal from '../DomPortal/DomPortal';
import ForwardCanvasCSS from '../ForwardCanvasCSS/ForwardCanvasCSS';
import { RemoteParticipantVideoTracks } from '../ParticipantTracks/ParticipantTracks';

interface ParticipantObjects {
  sid: Participant.SID;
  object: CSS3DObject;
}

export default function Room() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [participantObjects, setParticipantObjects] = useState<ParticipantObjects[]>([]);

  function updateParticipantElements(sid: Participant.SID, element: HTMLElement | null) {
    if (element == null) {
      setParticipantObjects(participantObjects => participantObjects.filter(po => po.sid !== sid));
    } else {
      setParticipantObjects(participantObjects => [
        { sid: sid, object: new CSS3DObject(element) },
        ...participantObjects.filter(po => po.sid === sid),
      ]);
    }
  }

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
          const po = participantObjects.find(po => po.sid === participant.sid);
          return (
            po && (
              <RemoteParticipant
                key={participant.sid}
                participant={participant}
                object={po.object}
                requestLocation={setLocationRequested}
              />
            )
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
      <DomPortal>
        {participants.map(participant => (
          <div key={participant.sid} ref={e => updateParticipantElements(participant.sid, e)}>
            <ParticipantInfo participant={participant}>
              <RemoteParticipantVideoTracks participant={participant} />
            </ParticipantInfo>
          </div>
        ))}
      </DomPortal>
    </Controller>
  );
}
