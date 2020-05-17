import React from 'react';
import { LocalParticipant as ILocalParticipant } from 'twilio-video';
import { LocalParticipantVideoTracks } from '../ParticipantTracks/ParticipantTracks';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';

export interface LocalParticipantProps {
  participant: ILocalParticipant;
}

export default function LocalParticipant({ participant }: LocalParticipantProps) {
  return (
    <ParticipantInfo participant={participant}>
      <LocalParticipantVideoTracks participant={participant} />
    </ParticipantInfo>
  );
}
