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
  },
});

export default theme;
