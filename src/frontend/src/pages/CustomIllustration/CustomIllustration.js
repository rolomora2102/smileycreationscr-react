import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { ImagesURLObject } from '../../imagesURLs';

function CustomIllustration() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: ''
  });

  useEffect(() => {
    // Scroll hacia el tope al cargar el componente
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Verificar que todos los campos estén completos antes de enviar
    if (!formData.name || !formData.phone || !formData.email || !formData.description) {
      alert("Por favor, completa toda la información antes de enviar la solicitud.");
      return;
    }

    // Llamar a la función para abrir WhatsApp con el mensaje
    sendWhatsAppMessage();
  };

  // Función para enviar el mensaje a WhatsApp
  const sendWhatsAppMessage = () => {
    const phoneNumber = '50688725425'; // Número de WhatsApp en formato internacional sin signos

    // Formatear el mensaje con los datos del formulario
    const message = `
      *Pedido de Ilustración Personalizada*\n
      Nombre: ${formData.name}\n
      Teléfono: ${formData.phone}\n
      Correo: ${formData.email}\n
      \n*Descripción del Pedido:*\n
      ${formData.description}
    `;
    const encodedMessage = encodeURIComponent(message.trim());

    // Crear el enlace de WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva ventana o pestaña
    window.open(whatsappURL, '_blank');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 5 },
      }}
    >
      {/* Hero con imagen de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${ImagesURLObject.custom_illustration_hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(197, 108, 240, 0.7), rgba(255, 183, 197, 0.7))',
          padding: { xs: 3, sm: 4, md: 5 },
          borderRadius: 3,
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: 3,
            textShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          TUS SERES QUERIDOS A MI ESTILO
        </Typography>

        {/* Formulario */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: { xs: 2, md: 3 },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
      <Typography
        variant="h5"
        color="secondary"
        sx={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          marginBottom: 2,
        }}
      >
        ESCRÍBENOS PARA HACER TU PEDIDO
      </Typography>

      <TextField
        label="Nombre"
        name="name"
        variant="outlined"
        fullWidth
        required
        value={formData.name}
        onChange={handleInputChange}
      />

      <TextField
        label="Teléfono"
        name="phone"
        variant="outlined"
        fullWidth
        required
        value={formData.phone}
        onChange={handleInputChange}
      />

      <TextField
        label="Correo"
        name="email"
        variant="outlined"
        fullWidth
        required
        value={formData.email}
        onChange={handleInputChange}
      />

      <TextField
        label="Descripción"
        name="description"
        variant="outlined"
        fullWidth
        required
        multiline
        rows={4}
        value={formData.description}
        onChange={handleInputChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          marginTop: 2,
          padding: 1,
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        ENVIAR SOLICITUD
      </Button>
    </Box>
  </Box>
</Box>

  );
}

export default CustomIllustration;
