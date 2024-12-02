import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Divider, Paper, Stepper, Step, StepLabel, Tooltip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Carrito', 'Checkout', 'Confirmación'];

function Checkout() {
  const { cart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState(() => {
    const savedInfo = localStorage.getItem('customerInfo');
    return savedInfo ? JSON.parse(savedInfo) : { name: '', address: '', id: '', phoneNumber: '' };
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
  }, [customerInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleConfirmOrder = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.id || !customerInfo.phoneNumber) {
      alert("Por favor, completa toda la información del cliente antes de confirmar el pedido.");
      return;
    }

    // Llamar a la función para abrir WhatsApp con el mensaje
    sendWhatsAppMessage();

    alert(`Gracias por tu compra, ${customerInfo.name}!`);
    clearCart();
    localStorage.removeItem('customerInfo');
    navigate('/order-confirmation');
  };

  // Función para enviar el mensaje a WhatsApp
  const sendWhatsAppMessage = () => {
    const phoneNumber = '50688725425'; // Número de WhatsApp en formato internacional sin signos

    // Formatear el mensaje con los datos del cliente y el carrito
    const message = `
      *Nuevo Pedido*\n
      Nombre: ${customerInfo.name}\n
      Teléfono: ${customerInfo.phoneNumber}\n
      Cédula: ${customerInfo.id}\n
      Dirección Completa: ${customerInfo.address}\n
      \n*Detalles del Pedido:*\n
      ${cart.map(item => `- ${item.name} (x${item.quantity}) = ₡${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      \nTotal: ₡${calculateTotal()}
    `;
    const encodedMessage = encodeURIComponent(message.trim());

    // Crear el enlace de WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva ventana o pestaña
    window.open(whatsappURL, '_blank');
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="h5" sx={{fontWeight: 'bold'}} gutterBottom>
        CHECKOUT
      </Typography>
      {cart.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Typography variant="body1">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            ₡{item.price} x {item.quantity} = ₡{(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
      <Typography variant="h6" sx={{ mt: 2 }}>
        TOTAL: ₡{calculateTotal()}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          INFORMACION DEL CLIENTE
        </Typography>
        <TextField
          label="Nombre"
          name="name"
          value={customerInfo.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Teléfono"
          name="phoneNumber"
          value={customerInfo.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="Cédula"
            name="id"
            value={customerInfo.id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <Tooltip title="La cédula se solicita para poder hacer el envío por Correos de Costa Rica." enterTouchDelay={0}>
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="Dirección"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <Tooltip title="Por favor, escriba la dirección completa, incluyendo provincia, cantón y distrito para el envío por Correos de Costa Rica." enterTouchDelay={0}>
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmOrder}
          sx={{
            width: '100%',
            mt: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)', // Hace un pequeño zoom al hacer hover
              boxShadow: 6, // Añade sombra para resaltarlo
            },
          }}
          startIcon={<CheckCircleIcon />}
        >
          Confirmar Pedido
        </Button>
      </Box>
    </Paper>
  );
}

export default Checkout;
