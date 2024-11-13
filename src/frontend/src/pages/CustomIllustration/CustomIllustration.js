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
        height: { xs: '900px', sm: '600px', md: '1000px' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          transition: 'opacity 1s ease-in-out',
        }}
      />

      {/* Contenido del Hero */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '5%', md: '10%' },
          left: { xs: '2%', md: '10%' },
          right: { xs: '2%', md: '60%' },
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: { xs: '20px 40px', md: '30px 60px' },
          borderRadius: '8px',
        }}
      >
        <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', mb: 5 }}>
          Tus seres queridos en la forma más cute
        </Typography>

        {/* Formulario de contacto */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: 'background.paper',
            padding: 5,
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h4" color="secondary" align="center">
            Escríbenos para hacer tu pedido
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
            fullWidth
            sx={{
              mt: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            Enviar Solicitud
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CustomIllustration;
