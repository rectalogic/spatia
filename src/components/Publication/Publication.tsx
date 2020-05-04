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
  RemoteTrackPublication,
  Track,
  LocalParticipant,
  RemoteParticipant,
} from 'twilio-video';

export enum RenderTracks {
  None = 0,
  Audio = 1 << 1,
  Video = 1 << 2,
  Data = 1 << 3,
}

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

interface RemotePublicationProps {
  publication: RemoteTrackPublication;
  participant: RemoteParticipant;
  videoPriority: Track.Priority | null;
  audioPriority: Track.Priority | null;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
  renderTracks: RenderTracks;
}

export function RemotePublication({
  publication,
  videoPriority,
  audioPriority,
  onLocationChange,
  requestLocation,
  renderTracks,
}: RemotePublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return videoPriority && RenderTracks.Video === (renderTracks & RenderTracks.Video) ? (
        <VideoTrack track={track as IVideoTrack} priority={videoPriority} />
      ) : null;
    case 'audio':
      return audioPriority && RenderTracks.Audio === (renderTracks & RenderTracks.Audio) ? (
        <RemoteAudioTrack3D track={track as IRemoteAudioTrack} priority={audioPriority} />
      ) : null;
    case 'data':
      return RenderTracks.Data === (renderTracks & RenderTracks.Data) ? (
        <RemoteDataTrack
          track={track as IRemoteDataTrack}
          onLocationChange={onLocationChange}
          requestLocation={requestLocation}
        />
      ) : null;
    default:
      return null;
  }
}
