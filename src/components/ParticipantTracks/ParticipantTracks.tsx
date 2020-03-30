import React from 'react';
import {
  LocalParticipant,
  RemoteParticipant,
  Track,
  LocalTrackPublication,
  RemoteTrackPublication,
} from 'twilio-video';
import { LocalPublication, RemotePublication } from '../Publication/Publication';
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

interface RemoteParticipantTracksProps {
  participant: RemoteParticipant;
  videoPriority: Track.Priority | null;
  audioPriority: Track.Priority | null;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
}

export function RemoteParticipantTracks({
  participant,
  videoPriority,
  audioPriority,
  onLocationChange,
  requestLocation,
}: RemoteParticipantTracksProps) {
  const publications = usePublications(participant);

  return (
    <>
      {publications.map(publication => (
        <RemotePublication
          key={publication.kind}
          publication={publication as RemoteTrackPublication}
          participant={participant}
          videoPriority={videoPriority}
          audioPriority={audioPriority}
          onLocationChange={onLocationChange}
          requestLocation={requestLocation}
        />
      ))}
    </>
  );
}
