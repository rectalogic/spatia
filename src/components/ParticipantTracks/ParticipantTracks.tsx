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
import { LocationCallback, ParticipantLocation, RequestLocationCallback } from '../Participant/ParticipantLocation';

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
  locationRequested: Track.SID;
}

export function LocalParticipantTracks({ participant, location, locationRequested }: LocalParticipantTracksProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication => (
        <LocalPublication
          key={publication.kind}
          publication={publication as LocalTrackPublication}
          participant={participant}
          location={location}
          locationRequested={locationRequested}
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
}
export function RemoteParticipantAudioTracks({ participant }: RemoteParticipantAudioTracksProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication =>
        publication.kind === 'audio' ? (
          <RemoteAudioPublication key={publication.kind} publication={publication as RemoteAudioTrackPublication} />
        ) : null
      )}
    </>
  );
}

interface RemoteParticipantDataTracksProps {
  participant: RemoteParticipant;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
}
export function RemoteParticipantDataTracks({
  participant,
  onLocationChange,
  requestLocation,
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
            requestLocation={requestLocation}
          />
        ) : null
      )}
    </>
  );
}
