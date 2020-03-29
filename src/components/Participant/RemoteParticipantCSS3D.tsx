import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { RemoteParticipant } from 'twilio-video';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';
import { ParticipantLocation } from './ParticipantLocation';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { RemoteParticipantVideoTracks, RemoteParticipantAudioTracks } from '../ParticipantTracks/ParticipantTracks';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

interface RemoteParticipantCSS3DProps {
  sceneManager: SceneManagerCSS3D;
  participant: RemoteParticipant;
  location: ParticipantLocation;
}
export default function RemoteParticipantCSS3D({ sceneManager, participant, location }: RemoteParticipantCSS3DProps) {
  const root = useRef(document.createElement('div'));
  const [participant3D, setParticipant3D] = useState<THREE.Object3D | null>(null);
  const [disableVideo, setDisableVideo] = useState(false);

  useEffect(() => {
    const p3D = sceneManager.addRemoteParticipant(participant.sid);
    p3D.add(new CSS3DObject(root.current));
    setParticipant3D(p3D);
    return () => {
      setParticipant3D(sceneManager.removeRemoteParticipant(participant.sid));
    };
  }, [sceneManager, participant]);

  useEffect(() => {
    sceneManager.updateRemoteParticipant(participant.sid, location);
  }, [sceneManager, participant, location]);

  useEffect(() => {
    setDisableVideo(sceneManager.isLocationBehindCamera(location));
  }, [sceneManager, location]);

  return ReactDOM.createPortal(
    <>
      <div style={{ transform: 'rotateY(180deg) scale(2, 2)' }}>
        <ParticipantInfo participant={participant}>
          {disableVideo ? null : <RemoteParticipantVideoTracks participant={participant} />}
        </ParticipantInfo>
      </div>
      <RemoteParticipantAudioTracks
        participant={participant}
        sceneManager={sceneManager}
        participant3D={participant3D}
      />
    </>,
    root.current
  );
}
