// src/components/ClientForm/ClientForm.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { createClient, updateClient } from '../../services/clientService';

function ClientForm({ client, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    address: client?.address || '',
    phone: client?.phone || '',
    instagram: client?.instagram || '',
    id_number: client?.id_number || ''
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Para el banner de error

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        address: client.address || '',
        phone: client.phone || '',
        instagram: client.instagram || '',
        id_number: client.id_number || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.address) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phone) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe contener entre 8 y 15 dígitos';
    }
    if (!formData.id_number) newErrors.id_number = 'La cédula es obligatoria';
    if (!formData.instagram) newErrors.instagram = 'El Instagram es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (client?.id) {
        await updateClient(client.id, formData);
        setSnackbarMessage('Cliente actualizado con éxito');
      } else {
        await createClient(formData);
        setSnackbarMessage('Cliente creado con éxito');
      }
      setOpenSnackbar(true);
      setErrorMessage(''); // Limpiar el mensaje de error en caso de éxito
      if (onSave) onSave(); // Llama a onSave después de guardar exitosamente
      if (onClose) onClose(); // Cierra el formulario si onClose está definido
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      setErrorMessage(error.response?.data?.error || 'Hubo un error al guardar el cliente');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseErrorBanner = () => {
    setErrorMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {errorMessage && (
        <Alert severity="error" onClose={handleCloseErrorBanner} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <TextField
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        required
      />
      <TextField
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={!!errors.address}
        helperText={errors.address}
        required
      />
      <TextField
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <TextField
        label="Instagram"
        name="instagram"
        value={formData.instagram}
        onChange={handleChange}
        error={!!errors.instagram}
        helperText={errors.instagram}
      />
      <TextField
        label="Cédula"
        name="id_number"
        value={formData.id_number}
        onChange={handleChange}
        error={!!errors.id_number}
        helperText={errors.id_number}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {client?.id ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </Button>

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ClientForm;
