import { useEffect } from 'react';
import { RemoteDataTrack as IRemoteDataTrack } from 'twilio-video';
import { LocationCallback, RequestLocationCallback } from '../Participant/ParticipantLocation';

interface DataTrackProps {
  track: IRemoteDataTrack;
  onLocationChange: LocationCallback;
  requestLocation: RequestLocationCallback;
}

export default function RemoteDataTrack({ track, onLocationChange, requestLocation }: DataTrackProps) {
  useEffect(() => {
    function handleMessage(buffer: ArrayBuffer) {
      const locationBuffer = new Float64Array(buffer);
      // Length 1 buffer is a special flag to trigger us to resend our location
      if (locationBuffer.length === 1) {
        requestLocation(track.sid);
        return;
      }
      const location = { x: locationBuffer[0], z: locationBuffer[1], ry: locationBuffer[2] };
      onLocationChange(location);
    }
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track, onLocationChange, requestLocation]);
  return null;
}
