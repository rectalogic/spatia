import React, { useState } from 'react';
import * as THREE from 'three';
import { RemoteParticipantAudioTracks, RemoteParticipantDataTracks } from '../ParticipantTracks/ParticipantTracks';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation, RequestLocationCallback } from './ParticipantLocation';
import { useFrame } from 'react-three-fiber/css3d';
import { VIDEO_MAX_DISTANCE, AUDIO_MAX_DISTANCE } from '../../Globals';

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  object: THREE.Object3D;
  requestLocation: RequestLocationCallback;
}

export default function RemoteParticipant({ participant, object, requestLocation }: RemoteParticipantProps) {
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [disableVideo, setDisableVideo] = useState(false);
  const [disableAudio, setDisableAudio] = useState(false);

  const cameraPos = new THREE.Vector3();
  const participantPos = new THREE.Vector3();
  const participantPos4 = new THREE.Vector4();

  const onLocationChange = (location: ParticipantLocation) => setParticipantLocation(location);

  useFrame(({ camera }) => {
    let disableVideo = false;
    let disableAudio = false;
    camera.getWorldPosition(cameraPos);
    participantPos.set(participantLocation.x, 0, participantLocation.z);
    const distance = participantPos.distanceTo(cameraPos);

    if (distance > VIDEO_MAX_DISTANCE) {
      disableVideo = true;
    }

    if (distance > AUDIO_MAX_DISTANCE) {
      disableAudio = true;
    }

    if (!disableVideo) {
      participantPos4.set(participantLocation.x, 0, participantLocation.z, 1);
      participantPos4.applyMatrix4(camera.matrixWorldInverse);
      participantPos4.applyMatrix4(camera.projectionMatrix);
      // Behind camera
      if (participantPos4.w < 0) {
        disableVideo = true;
      }
    }

    setDisableVideo(disableVideo);
    setDisableAudio(disableAudio);
  });

  return (
    <group position={[participantLocation.x, 1, participantLocation.z]} rotation-y={participantLocation.ry}>
      {disableVideo ? null : <primitive object={object} />}
      {disableAudio ? null : <RemoteParticipantAudioTracks participant={participant} />}
      <RemoteParticipantDataTracks
        participant={participant}
        onLocationChange={onLocationChange}
        requestLocation={requestLocation}
      />
    </group>
  );
}
