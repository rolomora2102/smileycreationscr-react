// src/pages/AdminCustomers/AdminCustomers.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import ClientForm from '../../components/ClientForm/ClientForm';
import { getClients, deleteClient } from '../../services/clientService';
import { verifyToken } from '../../services/authService';

function AdminCustomers() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await verifyToken();
        setIsAdmin(adminStatus);
        if (adminStatus) {
          loadClients();
        }
      } catch (error) {
        console.error('Error verificando estado de admin:', error);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id);
      loadClients(); // Recargar clientes después de eliminar
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
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

  if (!isAdmin) {
    return <div>Acceso no autorizado</div>;
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
                <Button variant="outlined" color="error" onClick={() => handleDelete(client.id)}>
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
