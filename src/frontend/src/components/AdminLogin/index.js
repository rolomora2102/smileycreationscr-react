import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Tema para el diseño
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#d32f2f' },
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
