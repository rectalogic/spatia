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
import { Dom3DElementProps } from '../Dom3D/Dom3D';

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
  const participants = useParticipants();
  const [controlling, setControlling] = useState(false);
  const [locationRequested, setLocationRequested] = useState<Track.SID>('');
  const [infoElementProps, setInfoElementProps] = useState<Map<Participant.SID, Dom3DElementProps>>(new Map());

  function onStartController(e: PointerEvent) {
    e.stopPropagation();
    setControlling(true);
  }

  function onStopController(e: PointerEvent) {
    setControlling(false);
  }

  function updateInfoElementProps(sid: Participant.SID, elementProps: Dom3DElementProps | null) {
    // Need to clone map so change recognized https://medium.com/swlh/using-es6-map-with-react-state-hooks-800b91eedd5f
    if (elementProps == null) {
      if (infoElementProps.delete(sid)) {
        setInfoElementProps(new Map(infoElementProps));
      }
    } else {
      setInfoElementProps(new Map(infoElementProps.set(sid, elementProps)));
    }
  }

  function updateParticipant(sid: Participant.SID, e: HTMLElement | null) {
    if (e == null) {
      updateInfoElementProps(sid, null);
    }
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
                setInfoElementProps={p => updateInfoElementProps(participant.sid, p)}
                participant={participant}
                requestLocation={setLocationRequested}
              />
            ))}
          </World>
        </VideoContext.Provider>
      </Canvas>
      {participants
        .filter(participant => infoElementProps.has(participant.sid))
        .map(participant => {
          const elementProps = infoElementProps.get(participant.sid)!;
          return (
            <div
              key={participant.sid}
              ref={e => updateParticipant(participant.sid, e)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform:
                  'translate3d(' + elementProps.x + 'px,' + elementProps.y + 'px,0) scale(' + elementProps.scale + ')',
                opacity: elementProps.opacity,
              }}
            >
              <div style={{ transform: 'translate3d(-50%,-100%,0)' }}>
                <ParticipantInfo participant={participant} />
              </div>
            </div>
          );
        })}
    </CanvasContainer>
  );
}
