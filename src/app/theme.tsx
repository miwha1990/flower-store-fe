import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#ff9cea',
        },
        secondary: {
          main: '#E0C2FF',
        }
      }
    },
    light: {
      palette: {
        primary: {
          main: '#ad4898',
        },
        secondary: {
          main: '#E0C2FF',
        }
      }
    },
  },
});

export default theme;