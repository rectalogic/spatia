import { useCallback, useEffect, useState } from 'react';
import { ensureMediaPermissions } from '../../../utils';
import Video, { LocalVideoTrack, LocalAudioTrack, LocalDataTrack, CreateLocalTrackOptions } from 'twilio-video';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();

  const getLocalAudioTrack = useCallback((deviceId?: string) => {
    const options: CreateLocalTrackOptions = {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    return ensureMediaPermissions().then(() =>
      Video.createLocalAudioTrack(options).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      })
    );
  }, []);

  useEffect(() => {
    getLocalAudioTrack();
  }, [getLocalAudioTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalAudioTrack] as const;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();

  const getLocalVideoTrack = useCallback((newOptions?: CreateLocalTrackOptions) => {
    // In the DeviceSelector and FlipCameraButton components, a new video track is created,
    // then the old track is unpublished and the new track is published. Unpublishing the old
    // track and publishing the new track at the same time sometimes causes a conflict when the
    // track name is 'camera', so here we append a timestamp to the track name to avoid the
    // conflict.
    const options: CreateLocalTrackOptions = {
      frameRate: 24,
      height: 720,
      width: 1280,
      name: `camera-${Date.now()}`,
      ...newOptions,
    };

    return ensureMediaPermissions().then(() =>
      Video.createLocalVideoTrack(options).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      })
    );
  }, []);

  useEffect(() => {
    // We get a new local video track when the app loads.
    getLocalVideoTrack();
  }, [getLocalVideoTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalVideoTrack] as const;
}

export function useLocalDataTrack() {
  const [track, setTrack] = useState<LocalDataTrack>();

  useEffect(() => {
    setTrack(new Video.LocalDataTrack());
  }, []);

  return track;
}

export default function useLocalTracks() {
  const [audioTrack, getLocalAudioTrack] = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();
  const dataTrack = useLocalDataTrack();

  const localTracks = [audioTrack, videoTrack, dataTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
    | LocalDataTrack
  )[];

  return { localTracks, getLocalVideoTrack, getLocalAudioTrack };
}
