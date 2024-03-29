import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#00AFF9',
      main: '#0089C3',
      dark: '#0079AD',
      contrastText: '#fff',
    },
    secondary: {
      light: '#294B63',
      main: '#223E52',
      dark: '#1B3242',
      contrastText: '#fff',
    },
    background: {
      root: '#FCFCFC',
      paper: 'white',
    },
    error: {
      light: '#FF6161',
      main: '#ED2E50',
      dark: '#C30023',
      contrastText: '#fff',
    },
  },
  overrides: {
    MuiDataGrid: {
      root: {
        backgroundColor: 'white',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 15,
        margin: '8px',
      },
      outlined: {
        backgroundColor: 'white',
      },
    },
  },
});

export default responsiveFontSizes(theme);
