import React from 'react';
import {
  LocalParticipant,
  RemoteParticipant,
  Track,
  LocalTrackPublication,
  RemoteVideoTrackPublication,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
} from 'twilio-video';
import {
  LocalPublication,
  RemoteVideoPublication,
  RemoteAudioPublication,
  RemoteDataPublication,
} from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import {
  LocationChangeCallback,
  ParticipantLocation,
  RequestLocationBroadcastCallback,
} from '../Participant/ParticipantLocation';

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

interface LocalParticipantTracksProps {
  participant: LocalParticipant;
  location: ParticipantLocation;
  triggerLocationBroadcast: Track.SID;
}

export function LocalParticipantTracks({
  participant,
  location,
  triggerLocationBroadcast,
}: LocalParticipantTracksProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication => (
        <LocalPublication
          key={publication.kind}
          publication={publication as LocalTrackPublication}
          participant={participant}
          location={location}
          triggerLocationBroadcast={triggerLocationBroadcast}
        />
      ))}
    </>
  );
}

interface RemoteParticipantVideoTracksProps {
  participant: RemoteParticipant;
}
export function RemoteParticipantVideoTracks({ participant }: RemoteParticipantVideoTracksProps) {
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
  participant: RemoteParticipant;
  attachAudio: boolean;
}
export function RemoteParticipantAudioTracks({ participant, attachAudio }: RemoteParticipantAudioTracksProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'audio' ? (
          <RemoteAudioPublication
            key={publication.kind}
            publication={publication as RemoteAudioTrackPublication}
            attachAudio={attachAudio}
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
