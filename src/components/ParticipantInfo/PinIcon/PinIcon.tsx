import React from 'react';
import { Pin } from '@primer/octicons-react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';

interface PinIconProps {
  isPinned?: boolean;
  onClick: () => void;
}

export default function PinIcon({ isPinned, onClick }: PinIconProps) {
  return (
    <Tooltip
      title={isPinned ? 'Participant is pinned. Click to un-pin.' : 'Participant is not pinned. Click to pin.'}
      placement="top"
    >
      <SvgIcon
        onClick={onClick}
        style={{ float: 'right', fontSize: '29px' }}
        htmlColor={isPinned ? '#00ff00' : '#d3d3d3'}
      >
        <Pin />
      </SvgIcon>
    </Tooltip>
  );
}
