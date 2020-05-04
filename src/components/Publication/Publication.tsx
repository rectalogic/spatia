import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import RemoteAudioTrack3D from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import LocalDataTrack from '../DataTrack/LocalDataTrack';
import RemoteDataTrack from '../DataTrack/RemoteDataTrack';
import { ParticipantLocation, LocationCallback, RequestLocationCallback } from '../Participant/ParticipantLocation';

import { IVideoTrack } from '../../types';
import {
  RemoteAudioTrack as IRemoteAudioTrack,
  LocalDataTrack as ILocalDataTrack,
  RemoteDataTrack as IRemoteDataTrack,
  LocalTrackPublication,
  Track,
  LocalParticipant,
  RemoteVideoTrackPublication,
  RemoteAudioTrackPublication,
  RemoteDataTrackPublication,
} from 'twilio-video';

interface LocalPublicationProps {
  publication: LocalTrackPublication;
  participant: LocalParticipant;
  location: ParticipantLocation;
  locationRequested: Track.SID;
}

export function LocalPublication({ publication, location, locationRequested }: LocalPublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return <VideoTrack track={track as IVideoTrack} isLocal priority="standard" />;
    case 'audio':
      return null;
    case 'data':
      return (
        <LocalDataTrack track={track as ILocalDataTrack} location={location} locationRequested={locationRequested} />
      );
    default:
      return null;
  }
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
}
export function RemoteAudioPublication({ publication }: RemoteAudioPublicationProps) {
  const track = useTrack(publication);
  if (!track) return null;
  return <RemoteAudioTrack3D track={track as IRemoteAudioTrack} />;
}

interface RemoteDataPublicationProps {
  publication: RemoteDataTrackPublication;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
}
export function RemoteDataPublication({ publication, onLocationChange, requestLocation }: RemoteDataPublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;
  return (
    <RemoteDataTrack
      track={track as IRemoteDataTrack}
      onLocationChange={onLocationChange}
      requestLocation={requestLocation}
    />
  );
}
