import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Tema para el diseño
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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
