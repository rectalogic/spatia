import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Videocam from '@material-ui/icons/Videocam';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';

const useStyles = makeStyles({
  localContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4em',
    background: 'transparent',
  },
  remoteContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'column',
  },
  identity: {
    padding: '0.1em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  },
  icons: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    padding: '0.1em',
    '& svg': {
      stroke: 'black',
      strokeWidth: '0.8px',
    },
  },
});

interface ParticipantInfoProps {
  participant: Participant;
  isLocal?: boolean;
}

export default function ParticipantInfo({ participant, isLocal }: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName === 'camera');

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;

  const classes = useStyles();

  if (isLocal) {
    return (
      <div className={classes.localContainer} data-cy-participant={participant.identity}>
        <h4 className={classes.identity}>
          <ParticipantConnectionIndicator participant={participant} />
          {participant.identity}
        </h4>
        <div className={classes.icons}>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
          {isVideoSwitchedOff && <VideocamOff color="error" />}
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.remoteContainer} data-cy-participant={participant.identity}>
        <h4 className={classes.identity}>
          <ParticipantConnectionIndicator participant={participant} />
          {participant.identity}
        </h4>
        <div className={classes.icons}>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {isVideoSwitchedOff ? <VideocamOff color="error" /> : isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </div>
      </div>
    );
  }
}
