import React from 'react';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { PORTALS } from '../../Globals';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#9C9C9C',
    },
  })
);

interface PortalButtonsProps {
  setCenter: (center: [number, number, number] | null) => void;
}
export default function PortalButtons({ setCenter }: PortalButtonsProps) {
  const classes = useStyles();
  return (
    <ButtonGroup className={classes.root}>
      {PORTALS.map(portal => (
        <IconButton key={portal.color} onClick={() => setCenter(portal.position)}>
          <LockIcon htmlColor={portal.color} />
        </IconButton>
      ))}
      <IconButton onClick={() => setCenter(null)}>
        <LockOpenIcon />
      </IconButton>
    </ButtonGroup>
  );
}
