import React from 'react';
import { Mute, Unmute } from '@primer/octicons-react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';

interface SilenceIconProps {
  isSilenced?: boolean;
  onClick: () => void;
}

export default function SilenceIcon({ isSilenced, onClick }: SilenceIconProps) {
  return (
    <Tooltip
      title={
        isSilenced ? 'Participant is silenced. Click to un-silence.' : 'Participant is not silenced. Click to silence.'
      }
      placement="top"
    >
      <SvgIcon onClick={onClick} style={{ float: 'right', fontSize: '29px' }}>
        {isSilenced ? <Mute /> : <Unmute />}
      </SvgIcon>
    </Tooltip>
  );
}
