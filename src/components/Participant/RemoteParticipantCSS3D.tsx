import React, { useEffect, useState, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { RemoteParticipant } from 'twilio-video';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import { RemoteParticipantVideoTracks, RemoteParticipantAudioTracks } from '../ParticipantTracks/ParticipantTracks';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { WORLD_SCALE, VIDEO_WIDTH, VIDEO_HEIGHT, REMOTE_VIDEO_SCALE } from '../../Globals';

interface RemoteParticipantCSS3DProps {
  sceneManager: SceneManagerCSS3D;
  participant: RemoteParticipant;
  color: string;
  disableVideo: boolean;
}
export default function RemoteParticipantCSS3D({
  sceneManager,
  participant,
  color,
  disableVideo,
}: RemoteParticipantCSS3DProps) {
  const root = useRef(document.createElement('div'));
  const [participant3D, setParticipant3D] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    function createFace(width: number, height: number, color: string) {
      const element = document.createElement('div');
      element.style.width = width + 'px';
      element.style.height = height + 'px';
      element.style.background = color;
      element.style.opacity = '0.5';
      return element;
    }

    function addBackBox(object: THREE.Object3D, color: string) {
      const r = Math.PI / 2;
      const d = WORLD_SCALE / 2;
      const w = REMOTE_VIDEO_SCALE * VIDEO_WIDTH;
      const h = REMOTE_VIDEO_SCALE * VIDEO_HEIGHT;
      const size = [
        [d, h],
        [d, h],
        [w, d],
        [w, d],
      ];
      const pos = [
        [w / 2, 0, -d / 2],
        [-w / 2, 0, -d / 2],
        [0, h / 2, -d / 2],
        [0, -h / 2, -d / 2],
      ];
      const rot = [
        [0, r, 0],
        [0, -r, 0],
        [-r, 0, 0],
        [r, 0, 0],
      ];

      const backFace = createFace(w, h, color);
      const face = new CSS3DObject(backFace);
      face.position.z = -d;
      object.add(face);

      for (let i = 0; i < pos.length; i++) {
        const element = createFace(size[i][0], size[i][1], color);
        const face = new CSS3DObject(element);
        face.position.fromArray(pos[i]);
        face.rotation.fromArray(rot[i]);
        object.add(face);
      }
    }

    const p3D = sceneManager.addRemoteParticipant(participant.sid);
    p3D.add(new CSS3DObject(root.current));
    addBackBox(p3D, color);
    setParticipant3D(p3D);
    return () => {
      // Need to explicitly remove the CSS3DObject children so they remove their divs
      p3D.remove(...p3D.children);
      setParticipant3D(sceneManager.removeRemoteParticipant(participant.sid));
    };
  }, [sceneManager, participant, color]);

  useLayoutEffect(() => {
    sceneManager.render();
  }, [sceneManager, disableVideo]);

  return ReactDOM.createPortal(
    <div style={{ transform: `scale(${REMOTE_VIDEO_SCALE}, ${REMOTE_VIDEO_SCALE})` }}>
      <ParticipantInfo participant={participant}>
        {disableVideo ? null : <RemoteParticipantVideoTracks participant={participant} />}
      </ParticipantInfo>
      <RemoteParticipantAudioTracks
        participant={participant}
        sceneManager={sceneManager}
        participant3D={participant3D}
      />
    </div>,
    root.current
  );
}
