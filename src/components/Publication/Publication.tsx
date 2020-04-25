import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import RemoteAudioTrack3D from '../AudioTrack/AudioTrack';
import VideoTrack3D from '../VideoTrack/VideoTrack';
import LocalDataTrack from '../DataTrack/LocalDataTrack';
import RemoteDataTrack from '../DataTrack/RemoteDataTrack';
import { ParticipantLocation, LocationCallback, RequestLocationCallback } from '../Participant/ParticipantLocation';

import { IVideoTrack } from '../../types';
import {
  RemoteAudioTrack as IRemoteAudioTrack,
  LocalDataTrack as ILocalDataTrack,
  RemoteDataTrack as IRemoteDataTrack,
  LocalTrackPublication,
  RemoteTrackPublication,
  Track,
  LocalParticipant,
  RemoteParticipant,
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
      // Center point is top middle
      return (
        <group position-y={-0.5}>
          <VideoTrack3D track={track as IVideoTrack} priority="standard" />
        </group>
      );
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

interface RemotePublicationProps {
  publication: RemoteTrackPublication;
  participant: RemoteParticipant;
  videoPriority: Track.Priority | null;
  audioPriority: Track.Priority | null;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
}

export function RemotePublication({
  publication,
  videoPriority,
  audioPriority,
  onLocationChange,
  requestLocation,
}: RemotePublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return videoPriority ? <VideoTrack3D track={track as IVideoTrack} priority={videoPriority} /> : null;
    case 'audio':
      return audioPriority ? <RemoteAudioTrack3D track={track as IRemoteAudioTrack} priority={audioPriority} /> : null;
    case 'data':
      return (
        <RemoteDataTrack
          track={track as IRemoteDataTrack}
          onLocationChange={onLocationChange}
          requestLocation={requestLocation}
        />
      );
    default:
      return null;
  }
}
