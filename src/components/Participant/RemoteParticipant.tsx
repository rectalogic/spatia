import React, { useState } from 'react';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation, RequestLocationBroadcastCallback } from './ParticipantLocation';
import RemoteParticipantWebGL from './RemoteParticipantWebGL';
import SceneManager from '../../three/SceneManager';
import { RemoteParticipantDataTracks } from '../ParticipantTracks/ParticipantTracks';
import RemoteParticipantCSS3D from './RemoteParticipantCSS3D';

interface RemoteParticipantProps {
  sceneManager: SceneManager;
  participant: IRemoteParticipant;
  requestLocationBroadcast: RequestLocationBroadcastCallback;
}
export default function RemoteParticipant({
  sceneManager,
  participant,
  requestLocationBroadcast,
}: RemoteParticipantProps) {
  const [location, setLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  return (
    <>
      <RemoteParticipantCSS3D sceneManager={sceneManager.sceneCSS3D} participant={participant} location={location} />
      <RemoteParticipantWebGL sceneManager={sceneManager.sceneWebGL} participant={participant} location={location} />
      <RemoteParticipantDataTracks
        participant={participant}
        onLocationChange={setLocation}
        requestLocationBroadcast={requestLocationBroadcast}
      />
    </>
  );
}
