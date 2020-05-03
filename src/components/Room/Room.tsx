import React, { useState } from 'react';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import World from '../World/World';
import { Track, Participant } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ForwardCanvas from '../ForwardCanvas/ForwardCanvas';
import { ParticipantLocation } from '../Participant/ParticipantLocation';
import Controller from '../Controller/Controller';

export default function Room() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const [infoElements, setInfoElements] = useState<Map<Participant.SID, HTMLElement>>(new Map());
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });

  // https://github.com/facebook/react/issues/1899
  function updateInfoElements(sid: Participant.SID, e: HTMLElement | null) {
    if (e) {
      infoElements.set(sid, e);
    } else {
      infoElements.delete(sid);
    }
    setInfoElements(infoElements);
  }

  return (
    <Controller setLocalParticipantLocation={setLocalParticipantLocation}>
      <ForwardCanvas>
        <World>
          <LocalParticipant
            participant={localParticipant}
            participantLocation={localParticipantLocation}
            locationRequested={locationRequested}
          />
          {participants.map(participant => (
            <RemoteParticipant
              key={participant.sid}
              infoElement={infoElements.get(participant.sid) || null}
              participant={participant}
              requestLocation={setLocationRequested}
            />
          ))}
        </World>
      </ForwardCanvas>
      {participants.map(participant => (
        <div
          ref={e => updateInfoElements(participant.sid, e)}
          key={participant.sid}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <div style={{ transform: 'translate3d(-50%,-100%,0)' }}>
            <ParticipantInfo participant={participant} />
          </div>
        </div>
      ))}
    </Controller>
  );
}
