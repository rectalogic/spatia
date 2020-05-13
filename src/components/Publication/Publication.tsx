import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import RemoteAudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import LocalDataTrack from '../DataTrack/LocalDataTrack';
import RemoteDataTrack from '../DataTrack/RemoteDataTrack';
import {
  ParticipantLocation,
  LocationChangeCallback,
  RequestLocationBroadcastCallback,
} from '../Participant/ParticipantLocation';

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
  triggerLocationBroadcast: Track.SID;
}

export function LocalPublication({ publication, location, triggerLocationBroadcast }: LocalPublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return <VideoTrack track={track as IVideoTrack} isLocal priority="standard" />;
    case 'audio':
      return null;
    case 'data':
      return (
        <LocalDataTrack
          track={track as ILocalDataTrack}
          location={location}
          triggerLocationBroadcast={triggerLocationBroadcast}
        />
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
  attachAudio: boolean;
}
export function RemoteAudioPublication({ publication, attachAudio }: RemoteAudioPublicationProps) {
  const track = useTrack(publication);
  if (!track) return null;
  return <RemoteAudioTrack track={track as IRemoteAudioTrack} attachAudio={attachAudio} />;
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
