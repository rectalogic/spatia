import React, { useState } from 'react';
import { Canvas, PointerEvent } from 'react-three-fiber';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { VideoContext } from '../../components/VideoProvider';
import World from '../World/World';
import { Track } from 'twilio-video';

const CanvasContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  '& > div': {
    height: '100%',
  },
}));

export default function Room() {
  const videoContext = useVideoContext();
  const {
    room: { localParticipant },
  } = videoContext;
  const participants = useParticipants();
  const [controlling, setControlling] = useState(false);
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');

  function onStartController(e: PointerEvent) {
    e.stopPropagation();
    setControlling(true);
  }

  function onStopController(e: PointerEvent) {
    setControlling(false);
  }

  // We have to forward VideoContext into the Canvas - it has a different render-root
  // https://github.com/react-spring/react-three-fiber/issues/262
  return (
    <CanvasContainer>
      <Canvas onMouseDown={onStartController} onMouseLeave={onStopController} onMouseUp={onStopController}>
        <VideoContext.Provider value={videoContext}>
          <World>
            <LocalParticipant
              participant={localParticipant}
              controlling={controlling}
              locationRequested={locationRequested}
            />
            {participants.map(participant => (
              <RemoteParticipant
                key={participant.sid}
                participant={participant}
                requestLocation={setLocationRequested}
              />
            ))}
          </World>
        </VideoContext.Provider>
      </Canvas>
    </CanvasContainer>
  );
}
