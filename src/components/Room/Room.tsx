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
import { RenderTracks } from '../Publication/Publication';
import ForwardCanvasCSS from '../ForwardCanvasCSS/ForwardCanvasCSS';

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
        {participantObjects.map(po => {
          const participant = participants.find(p => p.sid === po.sid);
          return (
            participant && (
              <primitive key={po.sid} object={po.object}>
                <RemoteParticipant
                  participant={participant}
                  requestLocation={setLocationRequested}
                  renderTracks={RenderTracks.Audio | RenderTracks.Data}
                />
              </primitive>
            )
          );
        })}
      </ForwardCanvasCSS>
      <ParticipantInfo participant={localParticipant}>
        <LocalParticipant
          participant={localParticipant}
          participantLocation={localParticipantLocation}
          locationRequested={locationRequested}
        />
      </ParticipantInfo>
      <DomPortal>
        {participants.map(participant => (
          <div key={participant.sid} ref={e => updateParticipantElements(participant.sid, e)}>
            <ParticipantInfo participant={participant}>
              <RemoteParticipant
                participant={participant}
                requestLocation={setLocationRequested}
                renderTracks={RenderTracks.Video}
              />
            </ParticipantInfo>
          </div>
        ))}
      </DomPortal>
    </Controller>
  );
}
