import { useCallback } from 'react';
import { RemoteAudioTrack } from 'twilio-video';

export default function useRemoteAudioToggle(audioTrack: RemoteAudioTrack) {
  const isEnabled = audioTrack ? audioTrack.mediaStreamTrack.enabled : false;

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.mediaStreamTrack.enabled = !audioTrack.mediaStreamTrack.enabled;
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
