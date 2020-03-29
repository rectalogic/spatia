import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  disableAudio?: boolean;
}

export default function Participant({ participant, disableAudio }: ParticipantProps) {
  return (
    <ParticipantInfo participant={participant}>
      <ParticipantTracks participant={participant} disableAudio={disableAudio} />
    </ParticipantInfo>
  );
}
