import React from 'react';
import * as THREE from 'three';
import useTrack from '../../hooks/useTrack/useTrack';
import RemoteAudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import RemoteDataTrack from '../DataTrack/RemoteDataTrack';
import { LocationChangeCallback, RequestLocationBroadcastCallback } from '../Participant/ParticipantLocation';

import { IVideoTrack } from '../../types';
import {
  RemoteAudioTrack as IRemoteAudioTrack,
  RemoteDataTrack as IRemoteDataTrack,
  RemoteVideoTrackPublication,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
  LocalVideoTrackPublication,
} from 'twilio-video';
import SceneManagerCSS3D from '../../three/SceneManagerCSS3D';

interface LocalVideoPublicationProps {
  publication: LocalVideoTrackPublication;
}
export function LocalVideoPublication({ publication }: LocalVideoPublicationProps) {
  const track = useTrack(publication);
  if (!track) return null;
  return <VideoTrack track={track as IVideoTrack} isLocal priority="standard" />;
}

interface RemoteVideoPublicationProps {
  publication: RemoteVideoTrackPublication;
}
export function RemoteVideoPublication({ publication }: RemoteVideoPublicationProps) {
  const track = useTrack(publication);
  if (!track) return null;
  return <VideoTrack track={track as IVideoTrack} />;
}

interface RemoteAudioPublicationProps {
  publication: RemoteAudioTrackPublication;
  sceneManager: SceneManagerCSS3D;
  participant3D: THREE.Object3D | null;
}
export function RemoteAudioPublication({ publication, sceneManager, participant3D }: RemoteAudioPublicationProps) {
  const track = useTrack(publication);
  if (!track) return null;
  return (
    <RemoteAudioTrack track={track as IRemoteAudioTrack} sceneManager={sceneManager} participant3D={participant3D} />
  );
}

interface RemoteDataPublicationProps {
  publication: RemoteDataTrackPublication;
  onLocationChange: LocationChangeCallback;
  requestLocationBroadcast?: RequestLocationBroadcastCallback;
}
export function RemoteDataPublication({
  publication,
  onLocationChange,
  requestLocationBroadcast,
}: RemoteDataPublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;
  return (
    <RemoteDataTrack
      track={track as IRemoteDataTrack}
      onLocationChange={onLocationChange}
      requestLocationBroadcast={requestLocationBroadcast}
    />
  );
}
