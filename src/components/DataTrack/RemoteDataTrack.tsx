import { useEffect } from 'react';
import { RemoteDataTrack as IRemoteDataTrack } from 'twilio-video';
import { LocationChangeCallback, RequestLocationBroadcastCallback } from '../Participant/ParticipantLocation';

interface DataTrackProps {
  track: IRemoteDataTrack;
  onLocationChange: LocationChangeCallback;
  requestLocationBroadcast?: RequestLocationBroadcastCallback;
}

export default function RemoteDataTrack({ track, onLocationChange, requestLocationBroadcast }: DataTrackProps) {
  useEffect(() => {
    function handleMessage(buffer: ArrayBuffer) {
      const locationBuffer = new Float64Array(buffer);
      // Length 1 buffer is a special flag to trigger us to resend our location
      if (locationBuffer.length === 1) {
        requestLocationBroadcast && requestLocationBroadcast(track.sid);
        return;
      }
      const location = { x: locationBuffer[0], z: locationBuffer[1], ry: locationBuffer[2] };
      onLocationChange(location);
    }
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track, onLocationChange, requestLocationBroadcast]);
  return null;
}
