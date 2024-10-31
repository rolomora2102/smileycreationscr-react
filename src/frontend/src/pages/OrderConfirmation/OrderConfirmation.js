import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

function OrderConfirmation() {
  return (
    <Paper sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
        <Typography variant="h5" gutterBottom>
          ¡Gracias por tu compra!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hemos recibido tu pedido y estamos preparando todo para enviarlo.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 3 }}>
          Volver a la tienda
        </Button>
      </Box>
    </Paper>
  );
}

export default OrderConfirmation;
