import React from 'react';
import { LocalParticipant as ILocalParticipant, Track } from 'twilio-video';
import { LocalParticipantTracks } from '../ParticipantTracks/ParticipantTracks';
import { ParticipantLocation } from './ParticipantLocation';

export interface LocalParticipantProps {
  participant: ILocalParticipant;
  participantLocation: ParticipantLocation;
  triggerLocationBroadcast: Track.SID;
}

export default function LocalParticipant({
  participant,
  participantLocation,
  triggerLocationBroadcast,
}: LocalParticipantProps) {
  return (
    <LocalParticipantTracks
      participant={participant}
      location={participantLocation}
      triggerLocationBroadcast={triggerLocationBroadcast}
    />
  );
}
