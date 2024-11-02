import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../src/services/authService';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Llama a login para autenticar y guardar el token
      const success = await login(username, password);
      if (success) {
        window.location.href = "https://smileycreationscr.com";
      }
      // navigate('/'); // Redirige al usuario a la página principal /Local
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f8f8', // Color claro para fondo, consistente con tu estética
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: 300,
          padding: 4,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Iniciar Sesión
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            type="text"
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, paddingY: 1.2, fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
