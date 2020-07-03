import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}

// For screenshots, comment out the above and use this

// const faces = [
//   "https://images.generated.photos/Ql60mpl0vLUSqBZ1YN7kiKROV8ZSqV5dd9pbDU1z0w4/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA4ODAwNTQu/cG5n.png",
//   "https://images.generated.photos/QEEt96v4Ysf_AtazThxMj2A1vxaTcs_TdA5-I6w2aqo/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAxMDYyNDMu/cG5n.png",
//   "https://images.generated.photos/-rUHHw-aHz_infxRD6JrPgl13WRcyrbu4JaOxPW3KVI/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA4OTAyMjMu/cG5n.png",
//   "https://images.generated.photos/IxBBO2x9K-168_taejHqrxT9y2sfFcESFCrcchLi1LQ/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5MjY5MTAu/cG5n.png",
//   "https://images.generated.photos/UkDKPouDDbZiOLHcPk6vqOSNsdgFRbpoAYmrdoSXucI/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAzMDk1ODUu/cG5n.png",
//   "https://images.generated.photos/sgByAx3zZf0qh54SKtPZn9i_xmTW_FKa39INZhVDznQ/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5Nzk0OTku/cG5n.png",
//   "https://images.generated.photos/y-uCbEShljKbhjxrrnktySdcaQ5H_w9eTZd6dnYpIis/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAzNTk2NTUu/cG5n.png",
//   "https://images.generated.photos/SzA-AiznHIz0pnkh7vPafp_QMVb0A-5oS80A9XL1aJo/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA0MjYyNzQu/cG5n.png",
//   "https://images.generated.photos/qKfnNXm0zdZ55geqDWA4pumL0dmUYkysSoDesvbzIwg/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5NTk2MjMu/cG5n.png",
//   "https://images.generated.photos/0wwxAyBrw9rA04-qJ3Q-RBwjTMGLfWa1QsQh0mIaqsM/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA0Nzc4MDEu/cG5n.png",
// ];
// const trackFaces = new Map<IVideoTrack, string>();

// const Placeholder = styled('img')({
//   width: '100%',
//   maxHeight: '100%',
//   objectFit: 'contain',
//   background: '#C2C2C2',
// });

// export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
//   let url = trackFaces.get(track);
//   if (!url) {
//     url = faces.shift();
//     if (url) {
//       trackFaces.set(track, url);
//     }
//   }
//   return url ? <Placeholder src={url} /> : null;
// }
