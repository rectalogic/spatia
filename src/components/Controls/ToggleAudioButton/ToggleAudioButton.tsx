import React, { useCallback, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import { isChrome } from '../../../Globals';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleAudioButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  useEffect(() => {
    isChrome && toggleAudioEnabled(false);
  }, [toggleAudioEnabled]);

  const toggleAudio = useCallback(() => {
    toggleAudioEnabled();
  }, [toggleAudioEnabled]);

  // Chrome does not support echo cancellation, so force chrome users to use "push to talk"
  // so they don't ruin the experience for everyone else.
  // https://github.com/twilio/twilio-video.js/issues/323

  const enableAudio = useCallback(
    (e: React.PointerEvent) => {
      const target = e.currentTarget as Element;
      if (target) {
        target.setPointerCapture(e.pointerId);
        toggleAudioEnabled(true);
      }
    },
    [toggleAudioEnabled]
  );

  const disableAudio = useCallback(
    (e: React.PointerEvent) => {
      const target = e.currentTarget as Element;
      if (target) {
        target.releasePointerCapture(e.pointerId);
        toggleAudioEnabled(false);
      }
    },
    [toggleAudioEnabled]
  );

  return (
    <Tooltip
      title={isChrome ? 'Google Chrome users must "push to talk"' : isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <div onPointerDown={isChrome ? enableAudio : undefined} onPointerUp={isChrome ? disableAudio : undefined}>
        <Fab
          className={classes.fab}
          onClick={isChrome ? undefined : toggleAudio}
          disabled={props.disabled}
          data-cy-audio-toggle
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Fab>
      </div>
    </Tooltip>
  );
}
