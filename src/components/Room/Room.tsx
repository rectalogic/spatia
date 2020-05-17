import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import RemoteParticipant from '../Participant/RemoteParticipant';
import LocalParticipant from '../Participant/LocalParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Track, LocalDataTrack } from 'twilio-video';
import {
  ParticipantLocation,
  positionAroundPortal,
  marshalLocation,
  rotationToPortalAngle,
} from '../Participant/ParticipantLocation';
import { PORTALS, WORLD_RADIUS, WORLD_SCALE, VIDEO_HEIGHT } from '../../Globals';
import SceneManager from '../../three/SceneManager';
import { styled } from '@material-ui/core/styles';
import useController from '../../hooks/useController/useController';
import useKeyPress from '../../hooks/useController/useKeyPress';
import MapLocation from '../Participant/MapLocation';
import { useThrottle } from '../../hooks/useThrottle/useThrottle';

const Controller = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
}));

const CanvasWebGL = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
}));

const CanvasCSS3D = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0',
  height: '100%',
  width: '100%',
}));

const sceneManager = new SceneManager();
const THROTTLE_DISTANCE_EPSILON = 0.2 * (WORLD_SCALE * WORLD_SCALE);
const THROTTLE_ROTATION_EPSILON = THREE.MathUtils.degToRad(3);

interface RoomProps {
  portalCenter: [number, number, number] | null;
}

export default function Room({ portalCenter }: RoomProps) {
  const {
    room: { localParticipant },
    localTracks,
  } = useVideoContext();
  const localDataTrack = localTracks.find(track => track.kind === 'data') as LocalDataTrack;
  const participants = useParticipants();
  const [currentLocationBroadcastRequested, setCurrentLocationBroadcastRequested] = useState<Track.SID>('');
  const [localParticipantLocation, setLocalParticipantLocation] = useState<ParticipantLocation>(() =>
    positionAroundPortal(portalCenter || PORTALS[0]['position'], 2 * Math.PI * Math.random())
  );
  const locationThrottle = useCallback((previous: ParticipantLocation, current: ParticipantLocation) => {
    const dx = previous.x - current.x;
    const dz = previous.z - current.z;
    return (
      dx * dx + dz * dz >= THROTTLE_DISTANCE_EPSILON || Math.abs(previous.ry - current.ry) >= THROTTLE_ROTATION_EPSILON
    );
  }, []);
  const throttledLocalParticipantLocation = useThrottle(localParticipantLocation, locationThrottle);
  const [controllerRef, acceleration] = useController<HTMLDivElement>();
  const shiftKeyPressed = useKeyPress(['ShiftLeft', 'ShiftRight']);
  const canvasWebGLRef = useRef<HTMLDivElement>(null!);
  const canvasCSS3DRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const object = sceneManager.sceneWebGL.getLocalParticipant();
    // Free roam
    if (!portalCenter) {
      // Shift makes left/right strafe instead of rotate
      if (shiftKeyPressed) {
        object.translateX(-acceleration.x * (WORLD_SCALE / 10));
      } else {
        object.rotation.y += -acceleration.x / 100;
      }
      object.translateZ(acceleration.y * (WORLD_SCALE / 10));
      // Don't allow walking off the world
      if (object.position.length() > WORLD_RADIUS) {
        object.position.setLength(WORLD_RADIUS);
      }
    } else {
      const angle = rotationToPortalAngle(object.rotation.y) + -acceleration.x / 100;
      const location = positionAroundPortal(portalCenter, angle);
      object.rotation.y = location.ry;
      object.position.x = location.x;
      object.position.z = location.z;
    }
    setLocalParticipantLocation({ x: object.position.x, z: object.position.z, ry: object.rotation.y });
  }, [acceleration, shiftKeyPressed, portalCenter]);

  useEffect(() => {
    sceneManager.sceneWebGL.setParentElement(canvasWebGLRef.current);
    sceneManager.sceneCSS3D.setParentElement(canvasCSS3DRef.current);
    sceneManager.sceneCSS3D.resumeAudio();
  }, [canvasWebGLRef, canvasCSS3DRef]);

  useEffect(() => {
    sceneManager.updateLocalParticipant(localParticipantLocation);
  }, [localParticipantLocation]);

  useEffect(() => {
    localDataTrack.send(marshalLocation(localParticipantLocation));
    // When currentLocationBroadcastRequested changes, a remote participant is requesting a location resend
    // eslint-disable-next-line
  }, [currentLocationBroadcastRequested, localDataTrack]);

  useEffect(() => {
    localDataTrack.send(marshalLocation(throttledLocalParticipantLocation));
  }, [throttledLocalParticipantLocation, localDataTrack]);

  const onMapClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.currentTarget as SVGElement;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const z = (event.clientY - rect.top) / rect.height - 0.5;
      setLocalParticipantLocation(loc => {
        return { x: x * 2 * WORLD_RADIUS, z: z * 2 * WORLD_RADIUS, ry: loc.ry };
      });
    },
    [setLocalParticipantLocation]
  );

  return (
    <Controller ref={controllerRef}>
      <CanvasWebGL ref={canvasWebGLRef} />
      <CanvasCSS3D ref={canvasCSS3DRef} />

      <div style={{ position: 'absolute', top: '0', right: '0', zIndex: 1 }}>
        <svg
          width={VIDEO_HEIGHT + 'px'}
          height={VIDEO_HEIGHT + 'px'}
          viewBox={`${-WORLD_RADIUS} ${-WORLD_RADIUS} ${2 * WORLD_RADIUS} ${2 * WORLD_RADIUS}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle onClick={onMapClick} cx="0" cy="0" r={WORLD_RADIUS} fill="black" opacity="0.5" />
          {PORTALS.map(portal => (
            <circle cx={portal.position[0]} cy={portal.position[2]} r={WORLD_SCALE * 5} fill={portal.color} />
          ))}
          <MapLocation participant={localParticipant} location={localParticipantLocation} color="white" />
          {participants.map(participant => (
            <RemoteParticipant
              key={participant.sid}
              sceneManager={sceneManager}
              participant={participant}
              requestLocationBroadcast={setCurrentLocationBroadcastRequested}
            />
          ))}
        </svg>
      </div>

      <div style={{ position: 'absolute', width: '100%', top: '0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block' }}>
          <LocalParticipant participant={localParticipant} />
        </div>
      </div>
    </Controller>
  );
}
