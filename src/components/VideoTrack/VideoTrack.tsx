import React, { useRef, useEffect, useMemo } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track, VideoTrack as TVideoTrack } from 'twilio-video';
import * as THREE from 'three';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const isFrontFacing = track.mediaStreamTrack.getSettings().facingMode !== 'environment';
  const style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}

interface VideoTrack3DProps {
  track: IVideoTrack;
  priority: Track.Priority;
}

export default function VideoTrack3D({ track, priority }: VideoTrack3DProps) {
  // We should set muted on the video element, but this breaks chrome
  // https://bugs.chromium.org/p/chromium/issues/detail?id=898550
  const video = useMemo(() => document.createElement('video'), []);
  const ref = useRef<THREE.Object3D>();

  useEffect(() => {
    if (track.setPriority) {
      track.setPriority(priority);
    }
    track.attach(video);

    function scaleSprite(track: TVideoTrack) {
      const sprite = ref.current;
      if (sprite && track.dimensions.width && track.dimensions.height) {
        // Scale to fit in 1x1, keeping aspect ratio
        const scale = Math.min(1 / track.dimensions.width, 1 / track.dimensions.height);
        sprite.scale.set(scale * track.dimensions.width, scale * track.dimensions.height, 1);
      }
    }

    scaleSprite(track);
    track.on('dimensionsChanged', scaleSprite);
    track.on('started', scaleSprite);

    return () => {
      track.off('dimensionsChanged', scaleSprite);
      track.off('started', scaleSprite);
      track.detach(video);
      if (track.setPriority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [priority, track, video, ref]);

  return (
    <sprite ref={ref}>
      <spriteMaterial attach="material" sizeAttenuation={true}>
        <videoTexture attach="map" args={[video]} />
      </spriteMaterial>
    </sprite>
  );
}
