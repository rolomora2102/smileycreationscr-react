// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA726', // Ajusta según el color principal que prefieras
    },
    secondary: {
      main: '#FFB6C1', // Ajusta según el color secundario
    },
    background: {
      default: '#FFE6F0', // Fondo neutro
    },
    text: {
      primary: '#333333', // Color del texto principal
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontFamily: 'Lazy Dog, sans-serif' },
    h2: { fontFamily: 'Lazy Dog, sans-serif' },
    h3: { fontFamily: 'Lazy Dog, sans-serif' },
    h4: { fontFamily: 'Lazy Dog, sans-serif' },
    h5: { fontFamily: 'Lazy Dog, sans-serif' },
    h6: { fontFamily: 'Lazy Dog, sans-serif' },
    button: { fontFamily: 'Lazy Dog, sans-serif' }
  },
});

export default theme;
