import { useEffect } from 'react';
import { RemoteDataTrack as IRemoteDataTrack, LocalDataTrack } from 'twilio-video';
import {
  LocationChangeCallback,
  RequestLocationBroadcastCallback,
  unmarshalLocation,
  SendLocationTrigger,
} from '../Participant/ParticipantLocation';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

interface DataTrackProps {
  track: IRemoteDataTrack;
  onLocationChange: LocationChangeCallback;
  requestLocationBroadcast?: RequestLocationBroadcastCallback;
}

export default function RemoteDataTrack({ track, onLocationChange, requestLocationBroadcast }: DataTrackProps) {
  const { localTracks } = useVideoContext();
  const localDataTrack = localTracks.find(track => track.kind === 'data') as LocalDataTrack;

  useEffect(() => {
    // On mount, trigger a resend of remote locations
    localDataTrack.send(SendLocationTrigger);
  }, [localDataTrack]);

  useEffect(() => {
    function handleMessage(buffer: ArrayBuffer) {
      const locationBuffer = new Float64Array(buffer);
      // Length 1 buffer is a special flag to trigger us to resend our location
      if (locationBuffer.length === SendLocationTrigger.length) {
        requestLocationBroadcast && requestLocationBroadcast(track.sid);
        return;
      }
      onLocationChange(unmarshalLocation(locationBuffer));
    }
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track, onLocationChange, requestLocationBroadcast]);
  return null;
}
