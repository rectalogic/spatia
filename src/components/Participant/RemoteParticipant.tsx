import React, { useState, useEffect, useRef } from 'react';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation, RequestLocationBroadcastCallback } from './ParticipantLocation';
import RemoteParticipantWebGL from './RemoteParticipantWebGL';
import SceneManager from '../../three/SceneManager';
import { RemoteParticipantDataTracks } from '../ParticipantTracks/ParticipantTracks';
import RemoteParticipantCSS3D from './RemoteParticipantCSS3D';
import MapLocation from './MapLocation';
import randomColor from 'randomcolor';

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
  const [disableVideo, setDisableVideo] = useState(false);
  const color = useRef(randomColor());

  useEffect(() => {
    sceneManager.updateRemoteParticipant(participant.sid, location);
    setDisableVideo(sceneManager.sceneCSS3D.isLocationBehindCamera(location));
  }, [sceneManager, participant, location]);

  return (
    <>
      <RemoteParticipantCSS3D
        sceneManager={sceneManager.sceneCSS3D}
        participant={participant}
        color={color.current}
        disableVideo={disableVideo}
      />
      <RemoteParticipantWebGL sceneManager={sceneManager.sceneWebGL} participant={participant} />
      <MapLocation participant={participant} location={location} color={color.current} />
      <RemoteParticipantDataTracks
        participant={participant}
        onLocationChange={setLocation}
        requestLocationBroadcast={requestLocationBroadcast}
      />
    </>
  );
}
