import React, { useEffect, useRef } from 'react';
import { RemoteAudioTrack as IRemoteAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';

interface RemoteAudioTrackProps {
  track: IRemoteAudioTrack;
  attachAudio: boolean;
}

export default function RemoteAudioTrack({ track, attachAudio }: RemoteAudioTrackProps) {
  const { activeSinkId } = useAppState();
  const audioRef = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const audio = audioRef.current;
    if (attachAudio) {
      track.attach(audio);
      return () => {
        track.detach(audio);
      };
    }
  }, [attachAudio, audioRef, track]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.setSinkId?.(activeSinkId);
  }, [audioRef, activeSinkId]);

  return <audio ref={audioRef} />;
}
