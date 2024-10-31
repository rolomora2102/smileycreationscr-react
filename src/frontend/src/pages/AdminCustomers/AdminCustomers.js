// src/pages/AdminCustomers/AdminCustomers.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, TextField } from '@mui/material';
import ClientForm from '../../components/ClientForm/ClientForm';
import { getClients, deleteClient } from '../../services/clientService';

function AdminCustomers() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Autenticación básica
  const [password, setPassword] = useState('');

  const ADMIN_PASSWORD = 'admin123'; // Define tu contraseña aquí (esto es solo para desarrollo)

  useEffect(() => {
    if (isAuthenticated) loadClients();
  }, [isAuthenticated]);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const handleDelete = async (id) => {
    await deleteClient(id);
    loadClients();
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormSave = () => {
    loadClients(); // Recarga la lista de clientes después de guardar
    setShowForm(false);
    setEditingClient(null);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          marginTop: 5,
        }}
      >
        <Typography variant="h6">Ingrese la contraseña de administrador:</Typography>
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginTop: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Acceder
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Administración de Clientes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingClient(null);
          setShowForm(true);
        }}
        sx={{ marginBottom: 2 }}
      >
        Agregar Cliente
      </Button>

      {showForm && (
        <ClientForm client={editingClient} onSave={handleFormSave} onClose={() => setShowForm(false)} />
      )}

      <Grid container spacing={3} justifyContent="center">
        {clients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{client.name}</Typography>
              <Typography variant="body2">Email: {client.email}</Typography>
              <Typography variant="body2">Dirección: {client.address}</Typography>
              <Typography variant="body2">Teléfono: {client.phone}</Typography>
              <Typography variant="body2">Cédula: {client.id_number}</Typography>
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(client)} sx={{ mr: 1 }}>
                  Editar
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(client.id)}>
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminCustomers;
