import React, { useState } from 'react';
import { Canvas, PointerEvent } from 'react-three-fiber';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { VideoContext } from '../../components/VideoProvider';
import World from '../World/World';
import { Track, Participant } from 'twilio-video';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { useAppState, StateContext } from '../../state';

const CanvasContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
}));

export default function Room() {
  const videoContext = useVideoContext();
  const {
    room: { localParticipant },
  } = videoContext;
  const appState = useAppState();
  const participants = useParticipants();
  const [controlling, setControlling] = useState(false);
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const [infoElements, setInfoElements] = useState<Map<Participant.SID, HTMLElement>>(new Map());

  function onStartController(e: PointerEvent) {
    e.stopPropagation();
    setControlling(true);
  }

  function onStopController(e: PointerEvent) {
    setControlling(false);
  }

  // https://github.com/facebook/react/issues/1899
  function updateInfoElements(sid: Participant.SID, e: HTMLElement | null) {
    if (e) {
      infoElements.set(sid, e);
    } else {
      infoElements.delete(sid);
    }
    setInfoElements(infoElements);
  }

  // We have to forward VideoContext into the Canvas - it has a different render-root
  // https://github.com/react-spring/react-three-fiber/issues/262
  return (
    <CanvasContainer>
      <Canvas onMouseDown={onStartController} onMouseLeave={onStopController} onMouseUp={onStopController}>
        <VideoContext.Provider value={videoContext}>
          <StateContext.Provider value={appState}>
            <World>
              <LocalParticipant
                participant={localParticipant}
                controlling={controlling}
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
          </StateContext.Provider>
        </VideoContext.Provider>
      </Canvas>
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
    </CanvasContainer>
  );
}
