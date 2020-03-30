import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, LocalDataTrack, CreateLocalTrackOptions } from 'twilio-video';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();

  useEffect(() => {
    Video.createLocalAudioTrack().then(newTrack => {
      setTrack(newTrack);
    });
  }, []);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return track;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();

  const getLocalVideoTrack = useCallback((facingMode?: CreateLocalTrackOptions['facingMode']) => {
    const options: CreateLocalTrackOptions = {
      frameRate: 24,
      height: 720,
      width: 1280,
      name: 'camera',
    };

    if (facingMode) {
      options.facingMode = facingMode;
    }

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setTrack(newTrack);
      return newTrack;
    });
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
  const audioTrack = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();
  const dataTrack = useLocalDataTrack();

  const localTracks = [audioTrack, videoTrack, dataTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
    | LocalDataTrack
  )[];

  return { localTracks, getLocalVideoTrack };
}
