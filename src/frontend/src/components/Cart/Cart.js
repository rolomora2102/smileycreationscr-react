// src/components/Cart/Cart.js
import React from 'react';
import { Box, Typography, Button, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../contexts/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Carrito de Compras
      </Typography>
      {cart.length > 0 ? (
        cart.map((item) => (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Typography variant="body1">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Button
                size="small"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity === 1}
              >
                -
              </Button>
              <Typography variant="body2">{item.quantity}</Typography>
              <Button
                size="small"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => removeFromCart(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      ) : (
        <Typography variant="body2">El carrito está vacío</Typography>
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ${calculateTotal()}
      </Typography>
    </Box>
  );
}

export default Cart;
