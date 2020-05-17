import { createMuiTheme } from '@material-ui/core';
import { VIDEO_WIDTH, VIDEO_HEIGHT } from './Globals';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarHeight: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarHeight?: number;
    sidebarMobileHeight?: number;
  }
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#F22F46',
    },
  },
  sidebarWidth: VIDEO_WIDTH,
  sidebarHeight: VIDEO_HEIGHT,
  sidebarMobileHeight: VIDEO_HEIGHT,
});
