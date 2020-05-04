import React, { useState } from 'react';
import { RemoteParticipantTracks } from '../ParticipantTracks/ParticipantTracks';
import { RemoteParticipant as IRemoteParticipant, Track } from 'twilio-video';
import { ParticipantLocation, RequestLocationCallback } from './ParticipantLocation';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { VIDEO_MAX_DISTANCE, AUDIO_MAX_DISTANCE } from '../../Globals';
import { RenderTracks } from '../Publication/Publication';

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  requestLocation: RequestLocationCallback;
  renderTracks: RenderTracks;
}

export default function RemoteParticipant({ participant, requestLocation, renderTracks }: RemoteParticipantProps) {
  const [participantLocation, setParticipantLocation] = useState<ParticipantLocation>({ x: 0, z: 0, ry: 0 });
  const [videoPriority, setVideoPriority] = useState<Track.Priority | null>('standard');
  const [audioPriority, setAudioPriority] = useState<Track.Priority | null>('standard');
  const cameraPos = new THREE.Vector3();
  const participantPos = new THREE.Vector3();
  const participantPos4 = new THREE.Vector4();

  const onLocationChange = (location: ParticipantLocation) => setParticipantLocation(location);

  useFrame(({ camera }) => {
    camera.getWorldPosition(cameraPos);
    participantPos.set(participantLocation.x, 0, participantLocation.z);
    const distance = participantPos.distanceTo(cameraPos);

    let newVideoPriority: Track.Priority | null = 'standard';
    let newAudioPriority: Track.Priority | null = 'standard';

    if (distance > VIDEO_MAX_DISTANCE) {
      newVideoPriority = null;
    } else if (distance > VIDEO_MAX_DISTANCE / 2) {
      newVideoPriority = 'low';
    }

    if (distance > AUDIO_MAX_DISTANCE) {
      newAudioPriority = null;
    } else if (distance > AUDIO_MAX_DISTANCE / 2) {
      newAudioPriority = 'low';
    }

    if (newVideoPriority === 'standard') {
      participantPos4.set(participantLocation.x, 0, participantLocation.z, 1);
      participantPos4.applyMatrix4(camera.matrixWorldInverse);
      participantPos4.applyMatrix4(camera.projectionMatrix);
      // Behind camera
      if (participantPos4.w < 0) {
        newVideoPriority = null;
      }
    }

    setVideoPriority(newVideoPriority);
    setAudioPriority(newAudioPriority);
  });

  return (
    <RemoteParticipantTracks
      participant={participant}
      videoPriority={videoPriority}
      audioPriority={audioPriority}
      onLocationChange={onLocationChange}
      requestLocation={requestLocation}
      renderTracks={renderTracks}
    />
  );
}
