import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { RemoteParticipant as IRemoteParticipant } from 'twilio-video';
import { ParticipantLocation } from './ParticipantLocation';
import { useThree } from 'react-three-fiber/css3d';
import { WORLD_SCALE, AUDIO_REF_DISTANCE } from '../../Globals';

export interface RemoteParticipantProps {
  participant: IRemoteParticipant;
  participantLocation: ParticipantLocation;
  mediaRef: React.MutableRefObject<HTMLElement | null>;
  audioListenerRef: React.MutableRefObject<THREE.AudioListener | null>;
}

export default function RemoteParticipant({
  participant,
  participantLocation,
  mediaRef,
  audioListenerRef,
}: RemoteParticipantProps) {
  const [disableVideo, setDisableVideo] = useState(false);
  const { camera } = useThree();
  const groupRef = useRef<THREE.Object3D>(null!);

  useEffect(() => {
    function isObjectBehindCamera() {
      const objectPos = new THREE.Vector3(participantLocation.x, 0, participantLocation.z);
      const cameraPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
      const deltaCamObj = objectPos.sub(cameraPos);
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      return deltaCamObj.angleTo(camDir) > Math.PI / 2;
    }
    setDisableVideo(isObjectBehindCamera());
  }, [camera, participantLocation]);

  useEffect(() => {
    if (disableVideo || !mediaRef.current) return;
    const element = document.getElementById('video' + participant.sid);
    if (element) {
      const group = groupRef.current;
      // CSS3D reparents, save the current parent
      const parent = element.parentElement;
      const cssObject = new CSS3DObject(element);
      group.add(cssObject);
      return () => {
        group.remove(cssObject);
        // Restore the original parent so reactjs does not get confused
        parent?.appendChild(element);
      };
    }
  }, [disableVideo, participant, mediaRef, groupRef]);

  useEffect(() => {
    if (!mediaRef.current || !audioListenerRef.current) return;
    const audioElements = [...mediaRef.current.getElementsByTagName('audio')];
    if (audioElements.length) {
      const listener = audioListenerRef.current;
      const group = groupRef.current;
      const sounds = audioElements.map(audio => {
        const sound = new THREE.PositionalAudio(listener);
        sound.setRefDistance(AUDIO_REF_DISTANCE);
        sound.setMediaElementSource(audio);
        group.add(sound);
        return sound;
      });
      return () => {
        for (const sound of sounds) {
          group.remove(sound);
        }
      };
    }
  }, [camera, audioListenerRef, mediaRef]);

  return (
    <group
      ref={groupRef}
      position={[participantLocation.x, WORLD_SCALE, participantLocation.z]}
      rotation-y={participantLocation.ry}
    />
  );
}
