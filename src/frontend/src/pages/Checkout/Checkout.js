import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Divider, Paper, Stepper, Step, StepLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Carrito', 'Checkout', 'Confirmación'];

function Checkout() {
  const { cart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState(() => {
    const savedInfo = localStorage.getItem('customerInfo');
    return savedInfo ? JSON.parse(savedInfo) : { name: '', address: '', email: '' };
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
    if (!customerInfo.name || !customerInfo.address || !customerInfo.email) {
      alert("Por favor, completa toda la información del cliente antes de confirmar el pedido.");
      return;
    }
    alert(`Gracias por tu compra, ${customerInfo.name}!`);
    clearCart();
    localStorage.removeItem('customerInfo');
    navigate('/order-confirmation');
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
      <Typography variant="h5" gutterBottom>
        Checkout
      </Typography>
      {cart.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Typography variant="body1">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ${calculateTotal()}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información del Cliente
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
          label="Dirección"
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Correo Electrónico"
          name="email"
          value={customerInfo.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
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
