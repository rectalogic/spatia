import React from 'react';
import * as THREE from 'three';
import {
  LocalParticipant,
  RemoteParticipant,
  RemoteVideoTrackPublication,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
  LocalVideoTrackPublication,
} from 'twilio-video';
import {
  RemoteVideoPublication,
  RemoteAudioPublication,
  RemoteDataPublication,
  LocalVideoPublication,
} from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import { LocationChangeCallback, RequestLocationBroadcastCallback } from '../Participant/ParticipantLocation';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

interface LocalParticipantVideoTracksProps {
  participant: LocalParticipant;
}
export function LocalParticipantVideoTracks({ participant }: LocalParticipantVideoTracksProps) {
  // return placeholder(participant);
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'video' ? (
          <LocalVideoPublication key={publication.kind} publication={publication as LocalVideoTrackPublication} />
        ) : null
      )}
    </>
  );
}

interface RemoteParticipantVideoTracksProps {
  participant: RemoteParticipant;
}
export function RemoteParticipantVideoTracks({ participant }: RemoteParticipantVideoTracksProps) {
  // return placeholder(participant);
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'video' ? (
          <RemoteVideoPublication key={publication.kind} publication={publication as RemoteVideoTrackPublication} />
        ) : null
      )}
    </>
  );
}

interface RemoteParticipantAudioTracksProps {
  sceneManager: SceneManagerCSS3D;
  participant: RemoteParticipant;
  participant3D: THREE.Object3D | null;
}
export function RemoteParticipantAudioTracks({
  sceneManager,
  participant,
  participant3D,
}: RemoteParticipantAudioTracksProps) {
  // return <></>;
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'audio' ? (
          <RemoteAudioPublication
            key={publication.kind}
            publication={publication as RemoteAudioTrackPublication}
            sceneManager={sceneManager}
            participant3D={participant3D}
          />
        ) : null
      )}
    </>
  );
}

interface RemoteParticipantDataTracksProps {
  participant: RemoteParticipant;
  onLocationChange: LocationChangeCallback;
  requestLocationBroadcast?: RequestLocationBroadcastCallback;
}
export function RemoteParticipantDataTracks({
  participant,
  onLocationChange,
  requestLocationBroadcast,
}: RemoteParticipantDataTracksProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'data' ? (
          <RemoteDataPublication
            key={publication.kind}
            publication={publication as RemoteDataTrackPublication}
            onLocationChange={onLocationChange}
            requestLocationBroadcast={requestLocationBroadcast}
          />
        ) : null
      )}
    </>
  );
}

// Uncomment the following for screenshots

// // eslint-disable-next-line
// import { Participant } from 'twilio-video';
// // eslint-disable-next-line
// import { styled } from '@material-ui/core/styles';

// const Placeholder = styled('img')({
//   width: '100%',
//   maxHeight: '100%',
//   objectFit: 'contain',
//   background: '#C2C2C2',
// });

// const name2Face: { [key: string]: string } = {
//   "Karen": "https://images.generated.photos/Ql60mpl0vLUSqBZ1YN7kiKROV8ZSqV5dd9pbDU1z0w4/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA4ODAwNTQu/cG5n.png",
//   "Bill": "https://images.generated.photos/QEEt96v4Ysf_AtazThxMj2A1vxaTcs_TdA5-I6w2aqo/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAxMDYyNDMu/cG5n.png",
//   "Cindy": "https://images.generated.photos/-rUHHw-aHz_infxRD6JrPgl13WRcyrbu4JaOxPW3KVI/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA4OTAyMjMu/cG5n.png",
//   "Roger": "https://images.generated.photos/IxBBO2x9K-168_taejHqrxT9y2sfFcESFCrcchLi1LQ/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5MjY5MTAu/cG5n.png",
//   "Steve": "https://images.generated.photos/UkDKPouDDbZiOLHcPk6vqOSNsdgFRbpoAYmrdoSXucI/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAzMDk1ODUu/cG5n.png",
//   "Stephanie": "https://images.generated.photos/sgByAx3zZf0qh54SKtPZn9i_xmTW_FKa39INZhVDznQ/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5Nzk0OTku/cG5n.png",
//   "Laura": "https://images.generated.photos/y-uCbEShljKbhjxrrnktySdcaQ5H_w9eTZd6dnYpIis/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzAzNTk2NTUu/cG5n.png",
//   "Lianna": "https://images.generated.photos/SzA-AiznHIz0pnkh7vPafp_QMVb0A-5oS80A9XL1aJo/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA0MjYyNzQu/cG5n.png",
//   "Chad": "https://images.generated.photos/qKfnNXm0zdZ55geqDWA4pumL0dmUYkysSoDesvbzIwg/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA5NTk2MjMu/cG5n.png",
//   "Jane": "https://images.generated.photos/0wwxAyBrw9rA04-qJ3Q-RBwjTMGLfWa1QsQh0mIaqsM/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Ry/YW5zcGFyZW50X3Yz/L3YzXzA0Nzc4MDEu/cG5n.png",
// };

// function placeholder(participant: Participant) {
//   return <Placeholder src={name2Face[participant.identity]} />
// }
